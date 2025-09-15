import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { EntityManager, QueryOrder, wrap } from '@mikro-orm/core';
import {
  TherapySession,
  SessionStatus,
} from '../database/entities/therapy-session.entity';
import { Client, ClientStatus } from '../database/entities/client.entity';
import { Therapist } from '../database/entities/therapist.entity';
import {
  ClientTherapistAssignment,
  AssignmentStatus,
} from '../database/entities/client-therapist-assignment.entity';
import {
  CreateSessionDto,
  CreateSessionWithPredictionDto,
  UpdateSessionDto,
  SessionStatusUpdateDto,
  SessionQueryDto,
  SessionStatsQueryDto,
} from './dto';
import { UserStatus } from '../common/enums';

export interface SessionResponse {
  id: string;
  client: {
    id: string;
    fullName: string;
    age?: number;
    gender: string;
  };
  therapist: {
    id: string;
    user: {
      fullName: string;
      email: string;
    };
  };
  sessionNumber: number;
  title: string;
  description?: string;
  sessionDate: Date;
  sessionTime: string;
  duration: number;
  status: SessionStatus;
  notes?: string;
  techniques?: string[];
  issues?: string[];
  progress?: string;
  aiPredictions?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionStatsResponse {
  totalSessions: number;
  sessionsByStatus: Record<SessionStatus, number>;
  averageDuration: number;
  completionRate: number;
  upcomingSessions: number;
  sessionsByPeriod?: Array<{
    period: string;
    count: number;
    completedCount: number;
  }>;
  mostUsedTechniques: Array<{
    technique: string;
    count: number;
  }>;
  commonIssues: Array<{
    issue: string;
    count: number;
  }>;
}

@Injectable()
export class SessionsService {
  constructor(private readonly em: EntityManager) {}

  async create(
    createSessionDto: CreateSessionDto | CreateSessionWithPredictionDto,
    clinicId: string,
  ): Promise<SessionResponse> {
    // Validate client exists and belongs to clinic
    const client = await this.em.findOne(Client, {
      id: createSessionDto.clientId,
      clinic: clinicId,
    });

    if (!client) {
      throw new NotFoundException(
        `Client with ID ${createSessionDto.clientId} not found in your clinic`,
      );
    }

    // Validate therapist exists and belongs to clinic
    const therapist = await this.em.findOne(
      Therapist,
      {
        id: createSessionDto.therapistId,
        user: { clinic: { id: clinicId }, status: UserStatus.ACTIVE },
      },
      { populate: ['user'] },
    );

    if (!therapist) {
      throw new NotFoundException(
        `Active therapist with ID ${createSessionDto.therapistId} not found in your clinic`,
      );
    }

    // Check if client is assigned to therapist
    const assignment = await this.em.findOne(ClientTherapistAssignment, {
      client: createSessionDto.clientId,
      therapist: createSessionDto.therapistId,
      status: AssignmentStatus.ACTIVE,
    });

    if (!assignment) {
      throw new BadRequestException(
        'Client must be assigned to therapist before scheduling sessions',
      );
    }

    // Validate client status allows sessions
    if (client.status === ClientStatus.NEW) {
      throw new BadRequestException(
        'Client must be in ASSIGNED, CONSULTATION, or THERAPY status to schedule sessions',
      );
    }

    // Check for session number conflicts
    const existingSession = await this.em.findOne(TherapySession, {
      client: createSessionDto.clientId,
      therapist: createSessionDto.therapistId,
      sessionNumber: createSessionDto.sessionNumber,
    });

    if (existingSession) {
      throw new ConflictException(
        `Session number ${createSessionDto.sessionNumber} already exists for this client-therapist pair`,
      );
    }

    // Validate session date/time
    const sessionDateTime = new Date(
      `${createSessionDto.sessionDate}T${createSessionDto.sessionTime}`,
    );
    if (sessionDateTime <= new Date()) {
      throw new BadRequestException(
        'Session date and time must be in the future',
      );
    }

    // Check for therapist scheduling conflicts
    const conflictingSession = await this.em.findOne(TherapySession, {
      therapist: createSessionDto.therapistId,
      sessionDate: createSessionDto.sessionDate,
      sessionTime: createSessionDto.sessionTime,
      status: { $in: [SessionStatus.SCHEDULED, SessionStatus.IN_PROGRESS] },
    });

    if (conflictingSession) {
      throw new ConflictException(
        'Therapist already has a session scheduled at this time',
      );
    }

    // Create session
    const session = new TherapySession();
    session.client = client;
    session.therapist = therapist;
    session.sessionNumber = createSessionDto.sessionNumber;
    session.title = createSessionDto.title;
    session.description = createSessionDto.description;
    session.sessionDate = new Date(createSessionDto.sessionDate);
    session.sessionTime = createSessionDto.sessionTime;
    session.duration = createSessionDto.duration || 60;
    session.status = createSessionDto.status || SessionStatus.PLANNED;
    session.notes = createSessionDto.notes;
    session.techniques = createSessionDto.techniques;
    session.issues = createSessionDto.issues;
    session.progress = createSessionDto.progress;
    session.aiPredictions = (
      createSessionDto as CreateSessionWithPredictionDto
    ).aiPredictions;

    await this.em.persistAndFlush(session);

    // Return formatted response
    return this.formatSessionResponse(session, client, therapist);
  }

  async findAll(
    query: SessionQueryDto,
    clinicId: string,
    userRole?: string,
    userId?: string,
  ): Promise<{
    sessions: SessionResponse[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    // Build filter conditions
    const whereConditions: any = { client: { clinic: { id: clinicId } } };

    // Role-based filtering
    if (userRole === 'Therapist' && userId) {
      const therapist = await this.em.findOne(Therapist, { user: userId });
      if (therapist) {
        whereConditions.therapist = therapist.id;
      }
    }

    // Apply filters
    if (query.clientId) {
      whereConditions.client = query.clientId;
    }

    if (query.therapistId) {
      whereConditions.therapist = query.therapistId;
    }

    if (query.status && query.status.length > 0) {
      whereConditions.status = { $in: query.status };
    }

    if (query.dateFrom) {
      whereConditions.sessionDate = { $gte: new Date(query.dateFrom) };
    }

    if (query.dateTo) {
      if (whereConditions.sessionDate) {
        whereConditions.sessionDate.$lte = new Date(query.dateTo);
      } else {
        whereConditions.sessionDate = { $lte: new Date(query.dateTo) };
      }
    }

    if (query.sessionNumberFrom) {
      whereConditions.sessionNumber = { $gte: query.sessionNumberFrom };
    }

    if (query.sessionNumberTo) {
      if (whereConditions.sessionNumber) {
        whereConditions.sessionNumber.$lte = query.sessionNumberTo;
      } else {
        whereConditions.sessionNumber = { $lte: query.sessionNumberTo };
      }
    }

    if (query.search) {
      whereConditions.$or = [
        { title: { $ilike: `%${query.search}%` } },
        { description: { $ilike: `%${query.search}%` } },
        { notes: { $ilike: `%${query.search}%` } },
      ];
    }

    // Apply pagination and sorting
    const page = query.page || 1;
    const limit = query.limit || 20;
    const offset = (page - 1) * limit;

    const orderBy: Record<string, QueryOrder> = {};
    const sortField = query.sortBy || 'sessionDate';
    orderBy[sortField] =
      query.sortOrder === 'asc' ? QueryOrder.ASC : QueryOrder.DESC;

    const [sessions, total] = await this.em.findAndCount(
      TherapySession,
      whereConditions,
      {
        populate: ['client', 'therapist', 'therapist.user'],
        orderBy,
        limit,
        offset,
      },
    );

    const formattedSessions = sessions.map((session) => {
      const response: SessionResponse = {
        id: session.id,
        client: {
          id: session.client.id,
          fullName: session.client.fullName,
          age: session.client.age,
          gender: session.client.gender,
        },
        therapist: {
          id: session.therapist.id,
          user: {
            fullName: session.therapist.user.profile?.name || 'Unknown User',
            email: session.therapist.user.email,
          },
        },
        sessionNumber: session.sessionNumber,
        title: session.title,
        description: session.description,
        sessionDate: session.sessionDate,
        sessionTime: session.sessionTime,
        duration: session.duration,
        status: session.status,
        notes: session.notes,
        techniques: session.techniques,
        issues: session.issues,
        progress: session.progress,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
      };

      if (query.includePredictions && session.aiPredictions) {
        response.aiPredictions = session.aiPredictions;
      }

      return response;
    });

    return {
      sessions: formattedSessions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, clinicId: string): Promise<SessionResponse> {
    const session = await this.em.findOne(
      TherapySession,
      { id, client: { clinic: { id: clinicId } } },
      {
        populate: [
          'client',
          'therapist',
          'therapist.user',
          'therapist.user.profile',
        ],
      },
    );

    if (!session) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }

    return this.formatSessionResponse(
      session,
      session.client,
      session.therapist,
    );
  }

  async update(
    id: string,
    updateSessionDto: UpdateSessionDto,
    clinicId: string,
  ): Promise<SessionResponse> {
    const session = await this.em.findOne(
      TherapySession,
      { id, client: { clinic: { id: clinicId } } },
      {
        populate: [
          'client',
          'therapist',
          'therapist.user',
          'therapist.user.profile',
        ],
      },
    );

    if (!session) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }

    // Validate status transitions
    if (updateSessionDto.status && updateSessionDto.status !== session.status) {
      this.validateStatusTransition(session.status, updateSessionDto.status);
    }

    // Update session
    wrap(session).assign(updateSessionDto);

    await this.em.flush();

    return this.formatSessionResponse(
      session,
      session.client,
      session.therapist,
    );
  }

  async updateStatus(
    id: string,
    statusUpdateDto: SessionStatusUpdateDto,
    clinicId: string,
  ): Promise<SessionResponse> {
    const session = await this.em.findOne(
      TherapySession,
      { id, client: { clinic: { id: clinicId } } },
      {
        populate: [
          'client',
          'therapist',
          'therapist.user',
          'therapist.user.profile',
        ],
      },
    );

    if (!session) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }

    // Validate status transition
    this.validateStatusTransition(session.status, statusUpdateDto.status);

    // Update status
    session.status = statusUpdateDto.status;
    await this.em.flush();

    return this.formatSessionResponse(
      session,
      session.client,
      session.therapist,
    );
  }

  async remove(id: string, clinicId: string): Promise<void> {
    const session = await this.em.findOne(TherapySession, {
      id,
      client: { clinic: { id: clinicId } },
    });

    if (!session) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }

    // Only allow deletion if session is not in progress or completed
    if (
      session.status === SessionStatus.IN_PROGRESS ||
      session.status === SessionStatus.COMPLETED
    ) {
      throw new BadRequestException(
        'Cannot delete sessions that are in progress or completed',
      );
    }

    await this.em.removeAndFlush(session);
  }

  async getStatistics(
    query: SessionStatsQueryDto,
    clinicId: string,
    userRole?: string,
    userId?: string,
  ): Promise<SessionStatsResponse> {
    // Build filter conditions
    const whereConditions: any = { client: { clinic: { id: clinicId } } };

    // Role-based filtering
    if (userRole === 'Therapist' && userId) {
      const therapist = await this.em.findOne(Therapist, { user: userId });
      if (therapist) {
        whereConditions.therapist = therapist.id;
      }
    }

    // Apply filters
    if (query.clientId) {
      whereConditions.client = query.clientId;
    }

    if (query.therapistId) {
      whereConditions.therapist = query.therapistId;
    }

    if (query.dateFrom) {
      whereConditions.sessionDate = { $gte: new Date(query.dateFrom) };
    }

    if (query.dateTo) {
      if (whereConditions.sessionDate) {
        whereConditions.sessionDate.$lte = new Date(query.dateTo);
      } else {
        whereConditions.sessionDate = { $lte: new Date(query.dateTo) };
      }
    }

    const sessions = await this.em.find(TherapySession, whereConditions);

    // Calculate statistics
    const totalSessions = sessions.length;
    const sessionsByStatus = sessions.reduce(
      (acc, session) => {
        acc[session.status] = (acc[session.status] || 0) + 1;
        return acc;
      },
      {} as Record<SessionStatus, number>,
    );

    const completedSessions = sessionsByStatus[SessionStatus.COMPLETED] || 0;
    const averageDuration =
      sessions.length > 0
        ? sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length
        : 0;

    const completionRate =
      totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;

    const upcomingSessions =
      (sessionsByStatus[SessionStatus.SCHEDULED] || 0) +
      (sessionsByStatus[SessionStatus.PLANNED] || 0);

    // Analyze techniques and issues
    const techniqueCount: Record<string, number> = {};
    const issueCount: Record<string, number> = {};

    sessions.forEach((session) => {
      session.techniques?.forEach((technique) => {
        techniqueCount[technique] = (techniqueCount[technique] || 0) + 1;
      });

      session.issues?.forEach((issue) => {
        issueCount[issue] = (issueCount[issue] || 0) + 1;
      });
    });

    const mostUsedTechniques = Object.entries(techniqueCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([technique, count]) => ({ technique, count }));

    const commonIssues = Object.entries(issueCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([issue, count]) => ({ issue, count }));

    return {
      totalSessions,
      sessionsByStatus,
      averageDuration: Math.round(averageDuration),
      completionRate: Math.round(completionRate * 100) / 100,
      upcomingSessions,
      mostUsedTechniques,
      commonIssues,
    };
  }

  private validateStatusTransition(
    currentStatus: SessionStatus,
    newStatus: SessionStatus,
  ): void {
    const validTransitions: Record<SessionStatus, SessionStatus[]> = {
      [SessionStatus.PLANNED]: [
        SessionStatus.SCHEDULED,
        SessionStatus.CANCELLED,
      ],
      [SessionStatus.SCHEDULED]: [
        SessionStatus.IN_PROGRESS,
        SessionStatus.CANCELLED,
        SessionStatus.PLANNED,
      ],
      [SessionStatus.IN_PROGRESS]: [
        SessionStatus.COMPLETED,
        SessionStatus.CANCELLED,
      ],
      [SessionStatus.COMPLETED]: [], // Cannot change from completed
      [SessionStatus.CANCELLED]: [
        SessionStatus.PLANNED,
        SessionStatus.SCHEDULED,
      ],
    };

    const allowedStatuses = validTransitions[currentStatus] || [];

    if (!allowedStatuses.includes(newStatus)) {
      throw new BadRequestException(
        `Cannot transition from ${currentStatus} to ${newStatus}. Allowed transitions: ${allowedStatuses.join(', ')}`,
      );
    }
  }

  private formatSessionResponse(
    session: TherapySession,
    client: Client,
    therapist: Therapist,
  ): SessionResponse {
    return {
      id: session.id,
      client: {
        id: client.id,
        fullName: client.fullName,
        age: client.age,
        gender: client.gender,
      },
      therapist: {
        id: therapist.id,
        user: {
          fullName: therapist.user.profile?.name || 'Unknown User',
          email: therapist.user.email,
        },
      },
      sessionNumber: session.sessionNumber,
      title: session.title,
      description: session.description,
      sessionDate: session.sessionDate,
      sessionTime: session.sessionTime,
      duration: session.duration,
      status: session.status,
      notes: session.notes,
      techniques: session.techniques,
      issues: session.issues,
      progress: session.progress,
      aiPredictions: session.aiPredictions,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    };
  }
}

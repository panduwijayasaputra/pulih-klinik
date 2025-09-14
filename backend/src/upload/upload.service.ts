import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { User } from '../database/entities/user.entity';
import { Clinic } from '../database/entities/clinic.entity';
import * as fs from 'fs/promises';
import * as path from 'path';
import { v4 } from 'uuid';

export interface UploadResult {
  fileId: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedAt: Date;
}

@Injectable()
export class UploadService {
  private readonly uploadPath = process.env.UPLOAD_PATH || './uploads';
  private readonly maxFileSize = 10 * 1024 * 1024; // 10MB
  private readonly allowedImageTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
  ];
  private readonly allowedDocumentTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
  ];

  constructor(private readonly em: EntityManager) {
    this.ensureUploadDirectories();
  }

  async uploadUserAvatar(
    userId: string,
    file: Express.Multer.File,
  ): Promise<UploadResult> {
    // Validate user exists
    const user = await this.em.findOne(User, { id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Validate file
    this.validateImageFile(file);

    // Save file
    const uploadResult = await this.saveFile(file, 'avatars');

    // Update user avatar URL
    user.avatarUrl = uploadResult.url;
    await this.em.persistAndFlush(user);

    return uploadResult;
  }

  async uploadClinicLogo(
    clinicId: string,
    file: Express.Multer.File,
  ): Promise<UploadResult> {
    // Validate clinic exists
    const clinic = await this.em.findOne(Clinic, { id: clinicId });
    if (!clinic) {
      throw new NotFoundException('Clinic not found');
    }

    // Validate file
    this.validateImageFile(file);

    // Save file
    const uploadResult = await this.saveFile(file, 'logos');

    // Update clinic logo URL
    clinic.logoUrl = uploadResult.url;
    await this.em.persistAndFlush(clinic);

    return uploadResult;
  }

  async uploadDocument(
    file: Express.Multer.File,
    folder: string = 'documents',
  ): Promise<UploadResult> {
    // Validate file
    this.validateDocumentFile(file);

    // Save file
    return await this.saveFile(file, folder);
  }

  async uploadDocuments(
    files: Express.Multer.File[],
    folder: string = 'documents',
  ): Promise<UploadResult[]> {
    const results: UploadResult[] = [];

    for (const file of files) {
      const result = await this.uploadDocument(file, folder);
      results.push(result);
    }

    return results;
  }

  async deleteFile(fileId: string): Promise<void> {
    try {
      // Extract path from fileId (assuming fileId contains path info)
      const filePath = path.join(this.uploadPath, fileId);
      await fs.unlink(filePath);
    } catch (error) {
      // File might not exist, which is okay
      console.log(`Failed to delete file ${fileId}:`, error);
    }
  }

  private async saveFile(
    file: Express.Multer.File,
    folder: string,
  ): Promise<UploadResult> {
    const fileId = v4();
    const fileExtension = path.extname(file.originalname);
    const fileName = `${fileId}${fileExtension}`;
    const folderPath = path.join(this.uploadPath, folder);
    const filePath = path.join(folderPath, fileName);

    // Ensure folder exists
    await fs.mkdir(folderPath, { recursive: true });

    // Write file
    await fs.writeFile(filePath, file.buffer);

    // Generate URL (this would be your CDN/static file server URL in production)
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const url = `${baseUrl}/uploads/${folder}/${fileName}`;

    return {
      fileId,
      fileName,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      url,
      uploadedAt: new Date(),
    };
  }

  private validateImageFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException(
        `File size exceeds ${this.maxFileSize / (1024 * 1024)}MB limit`,
      );
    }

    if (!this.allowedImageTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${this.allowedImageTypes.join(', ')}`,
      );
    }
  }

  private validateDocumentFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException(
        `File size exceeds ${this.maxFileSize / (1024 * 1024)}MB limit`,
      );
    }

    if (!this.allowedDocumentTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${this.allowedDocumentTypes.join(', ')}`,
      );
    }
  }

  private async ensureUploadDirectories(): Promise<void> {
    const directories = [
      path.join(this.uploadPath, 'avatars'),
      path.join(this.uploadPath, 'logos'),
      path.join(this.uploadPath, 'documents'),
      path.join(this.uploadPath, 'registration'),
    ];

    for (const dir of directories) {
      try {
        await fs.mkdir(dir, { recursive: true });
      } catch (error) {
        console.log(`Failed to create directory ${dir}:`, error);
      }
    }
  }
}

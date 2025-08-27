import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_INTERCEPTOR, APP_FILTER, APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig, environmentConfig } from './config';
import { AuthModule } from './auth';
import { UsersModule } from './users/users.module';
import { ClinicsModule } from './clinics/clinics.module';
import { TherapistsModule } from './therapists/therapists.module';
import { ClientsModule } from './clients/clients.module';
import { SessionsModule } from './sessions/sessions.module';
import { ConsultationsModule } from './consultations/consultations.module';
import {
  ResponseInterceptor,
  HttpExceptionFilter,
  ValidationPipe,
} from './common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    MikroOrmModule.forRoot(databaseConfig),
    ThrottlerModule.forRoot([
      {
        ttl: environmentConfig.THROTTLE_TTL,
        limit: environmentConfig.THROTTLE_LIMIT,
      },
    ]),
    AuthModule,
    UsersModule,
    ClinicsModule,
    TherapistsModule,
    ClientsModule,
    SessionsModule,
    ConsultationsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Global Response Interceptor
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    // Global Exception Filter
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    // Global Validation Pipe
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}

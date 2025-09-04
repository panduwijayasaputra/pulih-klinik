import { Module } from '@nestjs/common';
import { RegistrationController } from './registration.controller';
import { RegistrationService } from './registration.service';
import { EmailService } from '../lib/email/email.service';

@Module({
  controllers: [RegistrationController],
  providers: [RegistrationService, EmailService],
  exports: [RegistrationService],
})
export class RegistrationModule {}
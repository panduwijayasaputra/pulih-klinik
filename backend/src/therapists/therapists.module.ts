import { Module } from '@nestjs/common';
import { TherapistsController } from './therapists.controller';
import { TherapistsService } from './therapists.service';
import { EmailService } from '../lib/email/email.service';

@Module({
  controllers: [TherapistsController],
  providers: [TherapistsService, EmailService],
  exports: [TherapistsService],
})
export class TherapistsModule {}

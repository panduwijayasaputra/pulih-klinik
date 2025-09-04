import { Injectable, Logger } from '@nestjs/common';

export interface EmailVerificationData {
  email: string;
  name: string;
  code: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  sendVerificationEmail(data: EmailVerificationData): void {
    const { email, name, code } = data;

    // For development, log the verification code to console
    // In production, this would integrate with a real email service like SendGrid, AWS SES, etc.
    this.logger.log(`📧 Email Verification Code for ${email}:`);
    this.logger.log(`   Name: ${name}`);
    this.logger.log(`   Code: ${code}`);
    this.logger.log(`   Expires in: 15 minutes`);
    this.logger.log(`   ---`);

    // TODO: Replace with actual email sending logic
    // Example with SendGrid:
    // await this.sendGridService.send({
    //   to: email,
    //   from: 'noreply@smarttherapy.com',
    //   subject: 'Verify Your Email - Smart Therapy',
    //   html: this.generateVerificationEmailHtml(name, code),
    // });
  }

  private generateVerificationEmailHtml(name: string, code: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Email Verification - Smart Therapy</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">Smart Therapy - Email Verification</h2>
            
            <p>Halo ${name},</p>
            
            <p>Terima kasih telah mendaftar di Smart Therapy. Untuk menyelesaikan pendaftaran, silakan masukkan kode verifikasi berikut:</p>
            
            <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
              <h1 style="color: #2563eb; font-size: 32px; letter-spacing: 4px; margin: 0;">${code}</h1>
            </div>
            
            <p><strong>Kode ini berlaku selama 15 menit.</strong></p>
            
            <p>Jika Anda tidak meminta kode verifikasi ini, silakan abaikan email ini.</p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #6b7280;">
              Email ini dikirim secara otomatis. Mohon tidak membalas email ini.
            </p>
          </div>
        </body>
      </html>
    `;
  }
}

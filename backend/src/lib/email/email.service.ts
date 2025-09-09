import { Injectable, Logger } from '@nestjs/common';
import { environmentConfig } from '../../config/environment.config';

export interface EmailVerificationData {
  email: string;
  name: string;
  code: string;
}

export interface ResendConfig {
  apiKey: string;
  fromEmail: string;
  fromName: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resendConfig: ResendConfig;

  constructor() {
    this.resendConfig = {
      apiKey: environmentConfig.RESEND_API_KEY || '',
      fromEmail: environmentConfig.RESEND_FROM_EMAIL,
      fromName: environmentConfig.RESEND_FROM_NAME,
    };
  }

  async sendVerificationEmail(data: EmailVerificationData): Promise<void> {
    const { email, name, code } = data;

    // Debug logging
    this.logger.log(`📧 Attempting to send verification email to: ${email}`);
    this.logger.log(
      `🔧 Resend API Key configured: ${!!this.resendConfig.apiKey}`,
    );
    this.logger.log(`🔧 From Email: ${this.resendConfig.fromEmail}`);
    this.logger.log(`🔧 From Name: ${this.resendConfig.fromName}`);
    this.logger.log(
      `🔧 Dev Email Enabled: ${environmentConfig.DEV_EMAIL_ENABLED}`,
    );
    this.logger.log(
      `🔧 Dev Email Recipient: ${environmentConfig.DEV_EMAIL_RECIPIENT}`,
    );

    try {
      // Check if Resend is configured
      if (!this.resendConfig.apiKey) {
        this.logger.warn(
          'Resend API key not configured, falling back to console logging',
        );
        this.logToConsole(email, name, code);
        return;
      }

      // In development, check if we should redirect emails to a test recipient
      const actualRecipient = this.getActualRecipient(email);

      // Send email via Resend
      await this.sendViaResend(actualRecipient, name, code);
      this.logger.log(
        `✅ Verification email sent successfully to ${actualRecipient}${actualRecipient !== email ? ` (redirected from ${email})` : ''}`,
      );
    } catch (error) {
      this.logger.error(
        `❌ Failed to send verification email to ${email}:`,
        error,
      );

      // In development, still log to console for debugging
      if (environmentConfig.NODE_ENV === 'development') {
        this.logger.warn(
          'Development mode: Also logging to console for debugging',
        );
        this.logToConsole(email, name, code);
      }

      // Re-throw error in production, but allow development to continue
      if (environmentConfig.NODE_ENV === 'production') {
        throw error;
      }
    }
  }

  private getActualRecipient(originalEmail: string): string {
    // In development, redirect all emails to a test recipient if configured
    if (
      environmentConfig.NODE_ENV === 'development' &&
      environmentConfig.DEV_EMAIL_ENABLED &&
      environmentConfig.DEV_EMAIL_RECIPIENT
    ) {
      this.logger.log(
        `🔄 Development mode: Redirecting email from ${originalEmail} to ${environmentConfig.DEV_EMAIL_RECIPIENT}`,
      );
      return environmentConfig.DEV_EMAIL_RECIPIENT;
    }

    return originalEmail;
  }

  private async sendViaResend(
    email: string,
    name: string,
    code: string,
  ): Promise<void> {
    const emailData = {
      from: `${this.resendConfig.fromName} <${this.resendConfig.fromEmail}>`,
      to: [email],
      subject: '🔐 Verifikasi Email - Pulih Klinik',
      html: this.generateVerificationEmailHtml(name, code),
    };

    this.logger.log(`📤 Sending email via Resend API to: ${email}`);
    this.logger.log(`📤 Email data:`, JSON.stringify(emailData, null, 2));

    // Use fetch to call Resend API directly
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.resendConfig.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    this.logger.log(
      `📤 Resend API response status: ${response.status} ${response.statusText}`,
    );

    if (!response.ok) {
      const errorData = await response.json();
      this.logger.error(`❌ Resend API error response:`, errorData);
      throw new Error(
        `Resend API error: ${errorData.message || response.statusText}`,
      );
    }

    const result = await response.json();
    this.logger.log(`📧 Email sent via Resend. ID: ${result.id}`);
    this.logger.log(`📧 Resend response:`, JSON.stringify(result, null, 2));
  }

  private logToConsole(email: string, name: string, code: string): void {
    this.logger.log(`📧 Email Verification Code for ${email}:`);
    this.logger.log(`   Name: ${name}`);
    this.logger.log(`   Code: ${code}`);
    this.logger.log(`   Expires in: 15 minutes`);
    this.logger.log(`   ---`);
  }

  private generateVerificationEmailHtml(name: string, code: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verifikasi Email - Pulih Klinik</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #1e40af; font-size: 28px; margin: 0; font-weight: 700;">Pulih Klinik</h1>
              <p style="color: #64748b; margin: 5px 0 0 0; font-size: 16px;">Platform Terapi Digital Terpercaya</p>
            </div>

            <!-- Main Content -->
            <div style="background-color: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
              <h2 style="color: #1e293b; font-size: 24px; margin: 0 0 20px 0; font-weight: 600;">Verifikasi Email Anda</h2>
              
              <p style="color: #475569; font-size: 16px; margin: 0 0 20px 0;">Halo <strong>${name}</strong>,</p>
              
              <p style="color: #475569; font-size: 16px; margin: 0 0 30px 0;">
                Terima kasih telah mendaftar di Pulih Klinik. Untuk menyelesaikan pendaftaran dan mengaktifkan akun Anda, silakan masukkan kode verifikasi berikut:
              </p>
              
              <!-- Verification Code -->
              <div style="background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); padding: 30px; text-align: center; margin: 30px 0; border-radius: 12px; box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.3);">
                <h1 style="color: #ffffff; font-size: 36px; letter-spacing: 8px; margin: 0; font-weight: 700; font-family: 'Courier New', monospace;">${code}</h1>
              </div>
              
              <!-- Instructions -->
              <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 30px 0;">
                <h3 style="color: #1e293b; font-size: 18px; margin: 0 0 15px 0; font-weight: 600;">📋 Instruksi:</h3>
                <ul style="color: #475569; font-size: 14px; margin: 0; padding-left: 20px;">
                  <li style="margin-bottom: 8px;">Masukkan kode verifikasi di halaman pendaftaran</li>
                  <li style="margin-bottom: 8px;">Kode ini berlaku selama <strong>15 menit</strong></li>
                  <li style="margin-bottom: 8px;">Setelah verifikasi, Anda dapat langsung login ke akun</li>
                </ul>
              </div>
              
              <!-- Security Notice -->
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 30px 0; border-radius: 0 8px 8px 0;">
                <p style="color: #92400e; font-size: 14px; margin: 0; font-weight: 500;">
                  🔒 <strong>Keamanan:</strong> Jika Anda tidak meminta kode verifikasi ini, silakan abaikan email ini dan hubungi tim support kami.
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; font-size: 12px; margin: 0 0 10px 0;">
                Email ini dikirim secara otomatis. Mohon tidak membalas email ini.
              </p>
              <p style="color: #64748b; font-size: 12px; margin: 0;">
                © 2024 Pulih Klinik. Semua hak dilindungi.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}

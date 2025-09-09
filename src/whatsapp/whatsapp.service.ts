import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);
  private client: Twilio;
  private from: string;

  constructor(private readonly config: ConfigService) {
    const accountSid = this.config.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.config.get<string>('TWILIO_AUTH_TOKEN');
    this.from = this.config.get<string>('TWILIO_WHATSAPP_FROM'); // e.g. whatsapp:+14155238886

    if (!accountSid || !authToken || !this.from) {
      this.logger.error(
        '❌ Missing Twilio config. Please set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM in your .env',
      );
      throw new Error('Twilio config not set');
    }

    this.client = new Twilio(accountSid, authToken);
  }

  /**
   * Ensure numbers are in E.164 format for India (+91 prefix).
   */
  private formatNumber(phoneNumber: string): string {
    let formatted = phoneNumber.replace(/\D/g, ''); // keep only digits
    if (!formatted.startsWith('91')) {
      formatted = '91' + formatted;
    }
    return `+${formatted}`;
  }

  /**
   * Send a WhatsApp message (text only or with media).
   * @param to Recipient phone number (e.g. 8813947793 or +918813947793)
   * @param body Text content
   * @param mediaUrl Optional publicly accessible media URL (image, PDF, etc.)
   */
  async sendMessage(to: string, body: string, mediaUrl?: string) {
    try {
      const formattedTo = this.formatNumber(to);

      const payload: any = {
        from: this.from,
        to: `whatsapp:${formattedTo}`,
        body,
      };

      if (mediaUrl) {
        payload.mediaUrl = [mediaUrl];
      }

      const message = await this.client.messages.create(payload);
      this.logger.log(
        `📤 Sent WhatsApp message to ${formattedTo}, SID: ${message.sid}`,
      );
      return message;
    } catch (error) {
      this.logger.error(`❌ Failed to send message to ${to}`, error);
      throw error;
    }
  }
}

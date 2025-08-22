import { Injectable, Logger } from '@nestjs/common';
import { Client, LocalAuth } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';
import * as QRCode from 'qrcode'; // ✅ for saving QR as image
import { writeFileSync } from 'fs';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);
  private client: Client;

  // Simple queue to store pending messages
  private messageQueue: { phoneNumber: string; message: string }[] = [];
  private isSending = false;

  constructor() {
    this.client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // ✅ stability on VPS
      },
    });

    this.client.on('qr', async (qr) => {
      // Show QR in terminal
      qrcode.generate(qr, { small: false });

      // Save QR as PNG file
      try {
        const qrImageBuffer = await QRCode.toBuffer(qr);
        writeFileSync('qr.png', qrImageBuffer);
        this.logger.log('📸 QR code saved as qr.png (open and scan in WhatsApp)');
      } catch (err) {
        this.logger.error('❌ Failed to save QR code image', err);
      }
    });

    this.client.on('ready', () => {
      this.logger.log('✅ WhatsApp client is ready!');
    });

    this.client.initialize();
  }

  async sendMessage(phoneNumber: string, message: string) {
    // Remove all non-digits
    let formatted = phoneNumber.replace(/\D/g, '');

    // If user passed only 10 digits, prepend "91"
    if (formatted.length === 10) {
      formatted = '91' + formatted;
    }

    // ✅ Validate Indian mobile number (must start with 91, total 12 digits,
    // and 10-digit part must start with 6-9)
    if (!/^91[6-9]\d{9}$/.test(formatted)) {
      this.logger.warn(`❌ Rejected message: ${phoneNumber} is not a valid Indian mobile number`);
      return; // stop here
    }

    // ✅ WhatsApp requires "@c.us"
    if (!formatted.endsWith('@c.us')) {
      formatted = formatted + '@c.us';
    }

    this.messageQueue.push({ phoneNumber: formatted, message });
    this.processQueue();
  }

  private async processQueue() {
    if (this.isSending || this.messageQueue.length === 0) return;

    this.isSending = true;
    const { phoneNumber, message } = this.messageQueue.shift()!;

    try {
      await this.client.sendMessage(phoneNumber, message);
      this.logger.log(`📤 Message sent to ${phoneNumber}`);
    } catch (error) {
      this.logger.error(`❌ Failed to send message to ${phoneNumber}`, error);
    }

    // Wait for 2 minutes before sending the next one
    await new Promise((resolve) => setTimeout(resolve, 2 * 60 * 1000));

    this.isSending = false;
    this.processQueue();
  }
}

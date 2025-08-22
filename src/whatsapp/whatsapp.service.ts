import { Injectable, Logger } from '@nestjs/common';
import { Client, LocalAuth } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';
import * as QRCode from 'qrcode'; // for saving QR as image
import { writeFileSync, existsSync, unlinkSync } from 'fs';
import { join } from 'path';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);
  private client: Client;

  private messageQueue: { phoneNumber: string; message: string }[] = [];
  private isSending = false;

  constructor() {
    // 🧹 Clean up Chrome SingletonLock before starting
    const lockFile = join(process.cwd(), '.wwebjs_auth/session/SingletonLock');
    try {
      if (existsSync(lockFile)) {
        unlinkSync(lockFile);
        this.logger.warn('⚠️ Removed stale SingletonLock file before launching Chromium.');
      }
    } catch (err) {
      this.logger.error('❌ Failed to remove SingletonLock file', err);
    }

    this.client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        executablePath: '/usr/bin/chromium-browser', // ✅ make sure Chromium path is correct
      },
    });

    this.client.on('qr', async (qr) => {
      qrcode.generate(qr, { small: false });
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
    let formatted = phoneNumber.replace(/\D/g, '');
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

    await new Promise((resolve) => setTimeout(resolve, 2 * 60 * 1000));

    this.isSending = false;
    this.processQueue();
  }
}

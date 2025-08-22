import { Injectable, Logger } from '@nestjs/common';
import { Client, LocalAuth } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';
import * as QRCode from 'qrcode'; // for saving QR as image
import { writeFileSync } from 'fs';
import * as os from 'os';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);
  private client: Client;

  private messageQueue: { phoneNumber: string; message: string }[] = [];
  private isSending = false;

  constructor() {
    // Detect OS
    const isWindows = os.platform() === 'win32';

    this.client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu',
        ],
        // ✅ Use Chromium path only on Linux, let Puppeteer handle on Windows
        executablePath: isWindows ? undefined : '/usr/bin/chromium-browser',
      },
    });

    // Generate QR
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

    this.client.on('disconnected', (reason) => {
      this.logger.error(`⚠️ Client disconnected: ${reason}`);
    });

    this.client.initialize();
  }

  async sendMessage(phoneNumber: string, message: string) {
    // ✅ Clean number
    let formatted = phoneNumber.replace(/\D/g, '');

    // ✅ Always prepend +91 if not starting with country code
    if (!formatted.startsWith('91')) {
      formatted = '91' + formatted;
    }

    // ✅ Append WhatsApp suffix
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

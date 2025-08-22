import { Injectable, Logger } from '@nestjs/common';
import { Client, LocalAuth } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';
import * as QRCode from 'qrcode';
import { writeFileSync, existsSync, unlinkSync } from 'fs';
import * as path from 'path';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);
  private client: Client;
  private messageQueue: { phoneNumber: string; message: string }[] = [];
  private isSending = false;

  constructor() {
    // ✅ Check available Chrome/Chromium executables
    const possiblePaths = [
      '/usr/bin/google-chrome',
      '/usr/bin/chromium-browser',
      '/usr/bin/chromium',
    ];
    const executablePath = possiblePaths.find((p) => existsSync(p));

    if (!executablePath) {
      throw new Error(
        '❌ No Chrome/Chromium installation found. Please install one.'
      );
    }

    // ✅ Initialize WhatsApp client
    this.client = new Client({
      authStrategy: new LocalAuth({
        clientId: 'main', // 🔑 give each bot a unique ID if you run multiple
      }),
      puppeteer: {
        headless: true,
        executablePath,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
        ],
      },
    });

    // ✅ QR Code handler
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

    // ✅ Ready event
    this.client.on('ready', () => {
      this.logger.log('✅ WhatsApp client is ready!');
    });

    // 🧹 Clean up any stale SingletonLock before launching Chrome
    this.cleanupLock();
    this.client.initialize();
  }

  // 🧹 Remove stale Puppeteer/Chrome lock
  private cleanupLock() {
    const sessionLock = path.join(
      process.cwd(),
      'backend',
      '.wwebjs_auth',
      'session',
      'SingletonLock'
    );

    if (existsSync(sessionLock)) {
      try {
        unlinkSync(sessionLock);
        this.logger.log('🧹 Removed stale SingletonLock');
      } catch (err) {
        this.logger.warn('⚠️ Could not remove SingletonLock', err);
      }
    }
  }

  // ✅ Send message with validation
  async sendMessage(phoneNumber: string, message: string) {
    let formatted = phoneNumber.replace(/\D/g, '');

    if (formatted.length === 10) {
      formatted = '91' + formatted; // Default India
    }

    if (!/^91[6-9]\d{9}$/.test(formatted)) {
      this.logger.warn(`❌ Rejected message: ${phoneNumber} is not valid`);
      return;
    }

    if (!formatted.endsWith('@c.us')) {
      formatted = formatted + '@c.us';
    }

    this.messageQueue.push({ phoneNumber: formatted, message });
    this.processQueue();
  }

  // ✅ Queue processor (rate limit: 1 msg / 2 min)
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

    // wait 2 min before sending next
    await new Promise((resolve) => setTimeout(resolve, 2 * 60 * 1000));

    this.isSending = false;
    this.processQueue();
  }
}

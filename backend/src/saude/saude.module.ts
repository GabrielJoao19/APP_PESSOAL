import { Module } from '@nestjs/common';
import { SaudeController } from './saude.controller.js';
import { SaudeService } from './saude.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [SaudeController],
  providers: [SaudeService]
})
export class SaudeModule {}

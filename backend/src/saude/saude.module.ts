import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { SaudeController } from './saude.controller.js';
import { SaudeService } from './saude.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [SaudeController],
  providers: [SaudeService]
})
export class SaudeModule {}

import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AmoСrmService } from './amocrm.service';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [AmoСrmService],
  exports: [AmoСrmService],
})
export class AmoСrmModule {}

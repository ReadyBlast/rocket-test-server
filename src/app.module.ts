import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AmoСrmModule } from './amocrm/amocrm.module';

@Module({
  imports: [ConfigModule.forRoot(), HttpModule, AmoСrmModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

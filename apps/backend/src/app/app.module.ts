import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VagasModule } from './vagas/vagas.module.js';

@Module({
  imports: [VagasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { SolicitudesModule } from './solicitudes/solicitudes.module.js';

@Module({
  imports: [PrismaModule, SolicitudesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

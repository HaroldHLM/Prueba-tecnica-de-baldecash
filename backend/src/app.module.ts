import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module.js';
import { SolicitudesModule } from './solicitudes/solicitudes.module.js';

@Module({
  imports: [PrismaModule, SolicitudesModule],
})
export class AppModule {}

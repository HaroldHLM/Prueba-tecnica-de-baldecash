import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { SolicitudesService } from './solicitudes.service.js';
import { CreateSolicitudDto } from './dto/create-solicitud.dto.js';
import { QuerySolicitudesDto } from './dto/query-solicitudes.dto.js';
import { UpdateEstadoDto } from './dto/update-estado.dto.js';

@Controller('solicitudes')
export class SolicitudesController {
  constructor(private readonly solicitudesService: SolicitudesService) {}

  @Post()
  create(@Body() dto: CreateSolicitudDto) {
    return this.solicitudesService.create(dto);
  }

  @Get()
  findAll(@Query() query: QuerySolicitudesDto) {
    return this.solicitudesService.findAll(query);
  }

  @Patch(':id/estado')
  updateEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEstadoDto,
  ) {
    return this.solicitudesService.updateEstado(id, dto);
  }
}

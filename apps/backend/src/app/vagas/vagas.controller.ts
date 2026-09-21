import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { VagasService } from './vagas.service.js';
import { RankingRequestDto } from './dto/ranking-request.dto.js';
import type { RankingItemDto } from './dto/ranking-item.dto.js';

/**
 * Controller (MVC): só lida com a requisição/resposta HTTP e delega a lógica
 * de negócio para o `VagasService`.
 */
@Controller('vagas')
export class VagasController {
  constructor(private readonly vagasService: VagasService) {}

  @Post('ranking')
  @HttpCode(HttpStatus.OK)
  ranquear(@Body() body: RankingRequestDto): RankingItemDto[] {
    return this.vagasService.ranquear(body.curriculo, body.vagas);
  }
}

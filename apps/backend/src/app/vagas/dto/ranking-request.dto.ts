import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { VagaDto } from './vaga.dto.js';

export class RankingRequestDto {
  @IsString()
  @IsNotEmpty()
  curriculo!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => VagaDto)
  vagas!: VagaDto[];
}

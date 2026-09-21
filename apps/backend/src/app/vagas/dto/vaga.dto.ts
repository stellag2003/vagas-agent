import { IsNotEmpty, IsString } from 'class-validator';

export class VagaDto {
  @IsString()
  @IsNotEmpty()
  titulo!: string;

  @IsString()
  @IsNotEmpty()
  descricao!: string;
}

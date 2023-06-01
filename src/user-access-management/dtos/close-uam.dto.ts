import { IsOptional, IsString } from 'class-validator';

export class CloseUAMDTO {
  @IsOptional()
  @IsString()
  note: string;
}

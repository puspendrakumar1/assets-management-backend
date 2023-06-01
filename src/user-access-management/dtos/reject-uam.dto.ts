import { IsOptional, IsString } from 'class-validator';

export class RejectUAMDTO {
  @IsOptional()
  @IsString()
  note: string;
}

import { IsNotEmpty, IsString } from 'class-validator';

export class AssignUAMNumberDTO {
  @IsString()
  @IsNotEmpty()
  uamNumber: string;
}

import { IsNumber, IsString } from 'class-validator';

export class AddProductPresetsDto {
  @IsString() name: string;
  @IsString() make: string;
  @IsString() productCode: string;
  @IsString() type: string;
  @IsString() weightlife: string;
  @IsNumber() warranty: number;
}

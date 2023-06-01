import {
  IsDateString,
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateVisitDTO {
  @IsMongoId() @IsString() @IsNotEmpty() host: string;
  @IsString() @IsNotEmpty() firstName: string;
  @IsString() @IsNotEmpty() lastName: string;
  @IsNumberString() @IsNotEmpty() contactNo: string;
  @IsString() vehileNo: string;
  @IsString() purposeOfVisit: string;
  @IsEmail() email: string;
  @IsOptional() @IsString() company: string;
  @IsDateString() fromDateTime: Date;
  @IsOptional() @IsDateString() toDateTime: Date;
  @IsOptional() @IsDateString() actualVisitFromDateTime: Date;
  @IsOptional() @IsDateString() actualVisitToDateTime: Date;
}

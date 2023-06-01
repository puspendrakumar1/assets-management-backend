import { IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO class for Create Department
 * @export
 * @class CreateDepartmentDto
 */
export class CreateDepartmentDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

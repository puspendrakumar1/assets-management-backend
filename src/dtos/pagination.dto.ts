import { IsNotEmpty, IsNumber } from 'class-validator';

/**
 * DTO class for Pagination
 * @export
 * @class PaginatinoDto
 */
export class PaginatinoDto {
  @IsNumber() @IsNotEmpty() limit: number;
  @IsNumber() @IsNotEmpty() page: number;
}

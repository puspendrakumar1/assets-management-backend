import { IsString, IsUUID } from 'class-validator';
import { IdDto } from '../../dtos/id.dto';

/**
 * DTO class for Assign User To Audit
 * @export
 * @class AssignUserDto
 */
export class AssignUserDto extends IdDto {
  @IsString() @IsUUID() userId: string;
}

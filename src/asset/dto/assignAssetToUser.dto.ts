import { IsString, IsMongoId } from 'class-validator';
import { IdDto } from '../../dtos/id.dto';

/**
 * DTO class for Assigning Asset
 * @export
 * @class AssignAssetToUserDto
 */
export class AssignAssetToUserDto extends IdDto {
  @IsString() userId: string;
}

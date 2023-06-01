import { IsEnum, IsString } from 'class-validator';
import { AssetsAllocationStatus } from 'src/common/Enums';
import { IdDto } from '../../dtos/id.dto';

/**
 * DTO class for Updating allocation status
 * @export
 * @class UpdateAllocationStatusDto
 */
export class UpdateAllocationStatusDto extends IdDto {
  @IsString() @IsEnum(AssetsAllocationStatus) status: AssetsAllocationStatus;
}

import { IsEnum, IsOptional, IsString } from 'class-validator';
import { AssetAutoComplete } from 'src/common/Enums';

/**
 * DTO class for Asset Auto Complete Paginate Filter
 * @export
 * @class AssetAutoCompletePaginateDto
 */
export class AssetAutoCompletePaginateDto {
  @IsEnum(AssetAutoComplete) id: AssetAutoComplete;
}

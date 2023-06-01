import { IsEnum, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { ScannedAssetTypes } from 'src/common/Enums';

export class MoveToInPollDto {
  @IsMongoId()
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString() @IsEnum(ScannedAssetTypes) type: ScannedAssetTypes;
}

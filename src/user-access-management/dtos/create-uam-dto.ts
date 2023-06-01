import { Type } from 'class-transformer';
import { IsEnum, IsString, ValidateNested } from 'class-validator';
import { UAMPriority, UAMRequestTypeAction, UAMType } from 'src/common/Enums';
import { enumValidatorMessage } from 'src/common/utils/enum-validation-message.unil';
import { WindowsUAM } from './windows-uam.dto';

export class CreateUAMDTO {
  @IsString()
  @IsEnum(UAMRequestTypeAction, {
    message: enumValidatorMessage(UAMRequestTypeAction, 'requestTypeAction'),
  })
  requestTypeAction: UAMRequestTypeAction;
  @IsString()
  @IsEnum(UAMPriority, {
    message: enumValidatorMessage(UAMPriority, 'priority'),
  })
  priority: UAMPriority;
  @IsString()
  @IsEnum(UAMType, {
    message: enumValidatorMessage(UAMType, 'uamType'),
  })
  uamType: UAMType;

  /**
   * Windows type UAM
   */
  @ValidateNested()
  @Type(() => WindowsUAM)
  windows: WindowsUAM;
}

import { IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';
import { TicketingCallStatus, TicketingPriority } from 'src/common/Enums';
import { enumValidatorMessage } from 'src/common/utils/enum-validation-message.unil';

/**
 * DTO class for Update Ticketing Call status
 * @export
 * @class UpdateTicketingCallStatusDto
 */
export class UpdateTicketingCallStatusDto {
  @IsOptional() @IsString() assignedToUserId?: string;
  @IsOptional() @IsString() callMedium?: string;
  @IsOptional() @IsString() natureOfCall?: string;
  @IsOptional() @IsString() category?: string;
  // @IsString() @IsOptional() subCategory?: string;
  @IsOptional()
  @IsString()
  @IsEnum(TicketingCallStatus, {
    message: enumValidatorMessage(TicketingCallStatus, 'callStatus'),
  })
  callStatus?: string;
  @IsOptional()
  @IsString()
  @IsEnum(TicketingPriority, {
    message: enumValidatorMessage(TicketingPriority, 'priority'),
  })
  priority?: string;
  @IsOptional() @IsString() description: string;
  @IsOptional() @IsString() subject: string;
  @IsOptional() @IsString() closingDescription?: string;
}

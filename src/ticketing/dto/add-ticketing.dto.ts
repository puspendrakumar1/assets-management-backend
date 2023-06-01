import { IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';
import { TicketingCallStatus, TicketingPriority } from 'src/common/Enums';
import { enumValidatorMessage } from 'src/common/utils/enum-validation-message.unil';

/**
 * DTO class for Create Ticket
 * @export
 * @class AddTicketingDto
 */
export class AddTicketingDto {
  @IsString() requestFromUserId: string;
  @IsOptional() @IsString() assignedToUserId: string;
  @IsString() callMedium: string;
  @IsString() natureOfCall: string;
  @IsString() category: string;
  // @IsString() subCategory: string;
  @IsString()
  @IsEnum(TicketingCallStatus, {
    message: enumValidatorMessage(TicketingCallStatus, 'callStatus'),
  })
  callStatus: string;
  @IsString()
  @IsEnum(TicketingPriority, {
    message: enumValidatorMessage(TicketingPriority, 'priority'),
  })
  priority: string;
  @IsOptional() @IsString() description: string;
  @IsOptional() @IsString() subject: string;
}

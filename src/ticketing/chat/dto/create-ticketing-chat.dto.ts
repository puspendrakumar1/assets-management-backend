import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

/**
 * DTO class for Create Ticket Chat
 * @export
 * @class AddTicketingChatDto
 */
export class AddTicketingChatDto {
  @IsString() @IsMongoId() ticket: string;
  @IsString() @IsNotEmpty() message: string;
  @IsArray() @IsOptional() mentionedUsers: string[];
}

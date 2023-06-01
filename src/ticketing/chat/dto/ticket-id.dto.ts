import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO class for TicketId
 * @export
 * @class TicketIdDto
 */
export class TicketIdDto {
  @IsMongoId()
  @IsString()
  @IsNotEmpty()
  ticketId: string;
}

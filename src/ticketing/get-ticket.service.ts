import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { UserRole } from 'src/common/Enums';
import { ErrorCode } from 'src/common/ErrorCodes';
import { UserDocument } from 'src/users/schemas/user.schema';
import { Tickting, TicktingDocument } from './schemas/ticketing.schema';

@Injectable()
export class GetTicketingService {
  constructor(
    @InjectModel(Tickting.name)
    private ticktingModel: Model<TicktingDocument>,
  ) {}

  async getTicketById(
    id: string,
    currentUser: UserDocument,
  ): Promise<TicktingDocument> {
    const filter: FilterQuery<TicktingDocument> = {
      _id: id,
    };
    if (currentUser.role === UserRole.LEVEL3) {
      filter.requestFromUserId = currentUser._id;
    }

    const ticket = await this.ticktingModel.findOne(filter);
    if (!ticket) {
      throw new NotFoundException(
        'Ticket Not Found',
        ErrorCode.TICKET_NOT_FOUND,
      );
    }

    return ticket;
  }
}

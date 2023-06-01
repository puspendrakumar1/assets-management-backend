import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRole } from 'src/common/Enums';
import { CommonResponse } from 'src/common/interfaces';
import { UserDocument } from 'src/users/schemas/user.schema';
import { AddTicketingDto } from './dto/add-ticketing.dto';
import { Tickting, TicktingDocument } from './schemas/ticketing.schema';

@Injectable()
export class AddTicketingService {
  constructor(
    @InjectModel(Tickting.name)
    private ticktingModel: Model<TicktingDocument>,
  ) {}

  async addTicketing(
    addTicketingDto: AddTicketingDto,
    currentUser: UserDocument,
  ): Promise<CommonResponse> {
    /**
     * If User is Level3 then he/she can create ticket for only himself/herself
     */
    if (currentUser.role === UserRole.LEVEL3) {
      addTicketingDto.requestFromUserId = currentUser._id;
    }

    const ticket = await this.ticktingModel.insertMany({
      ...addTicketingDto,
      callesAttenedByUser: [
        // {
        //   userId: addTicketingDto.assignedToUserId,
        //   from: new Date(),
        // },
      ],
    });

    return { message: 'Ticket Created Successfully', data: ticket };
  }
}

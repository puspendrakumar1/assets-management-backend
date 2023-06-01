import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TicketingCallStatus } from 'src/common/Enums';
import { Tickting, TicktingDocument } from './schemas/ticketing.schema';

@Injectable()
export class TicketingService {
  constructor(
    @InjectModel(Tickting.name)
    private ticktingModel: Model<TicktingDocument>,
  ) {}

  async getTicketStatusCount() {
    const ticketCallStatusCount: { _id: string; count: number }[] =
      await this.ticktingModel
        .aggregate([
          {
            $group: {
              _id: '$callStatus',
              count: { $sum: 1 },
            },
          },
        ])
        .exec();

    const callStatusCount = {};

    Object.keys(TicketingCallStatus).forEach((callStatus) => {
      const currentticketCallStatusCount = ticketCallStatusCount.find(
        (currentCount) => currentCount._id === callStatus,
      );

      if (currentticketCallStatusCount) {
        Object.assign(callStatusCount, {
          [currentticketCallStatusCount._id]:
            currentticketCallStatusCount.count,
        });
      } else {
        Object.assign(callStatusCount, {
          [callStatus]: 0,
        });
      }
    });

    return callStatusCount;
  }

  async deleteTicketById(id: string) {
    await this.ticktingModel.findByIdAndDelete(id);
  }
}

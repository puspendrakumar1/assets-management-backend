import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as moment from 'moment';

import {
  TicktingDocument,
  Tickting,
} from 'src/ticketing/schemas/ticketing.schema';
import { TicketingCallStatus } from 'src/common/Enums';

@Injectable()
export class ITUserDashboardService {
  constructor(
    @InjectModel(Tickting.name) private ticketModel: Model<TicktingDocument>,
  ) {}

  async getITUserDashboardDetails(userId: string) {
    return {
      assignedTickets: await this.getITUserAssignedTickets(userId),
      todaysCompletedTickets: await this.getITUserTodaysCompletedTickets(
        userId,
      ),
      ongoingTickets: await this.getITUserOngoingTickets(userId),
    };
  }

  private async getITUserAssignedTickets(userId: string) {
    return this.ticketModel.countDocuments({
      assignedToUserId: userId,
    });
  }
  private async getITUserTodaysCompletedTickets(userId: string) {
    return this.ticketModel.countDocuments({
      assignedToUserId: userId,
      ticketClosedAt: {
        $gte: moment().startOf('day').toDate(),
        $lte: moment().endOf('day').toDate(),
      },
    });
  }
  private async getITUserOngoingTickets(userId: string) {
    return this.ticketModel.countDocuments({
      assignedToUserId: userId,
      callStatus: {
        $in: [
          TicketingCallStatus.Assigned,
          TicketingCallStatus['In Progress'],
          TicketingCallStatus.Open,
        ],
      },
    });
  }
}

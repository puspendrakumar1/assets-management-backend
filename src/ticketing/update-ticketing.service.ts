import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateQuery } from 'mongoose';
import { TicketingCallStatus } from 'src/common/Enums';
import { ErrorCode } from 'src/common/ErrorCodes';
import { CommonResponse } from 'src/common/interfaces';
import { UpdateTicketingCallStatusDto } from './dto/update-ticketing-call-status.dto';
import { Tickting, TicktingDocument } from './schemas/ticketing.schema';

@Injectable()
export class UpdateTicketingService {
  constructor(
    @InjectModel(Tickting.name)
    private ticktingModel: Model<TicktingDocument>,
  ) {}

  async updateTicketingCall(
    id: string,
    updateTicketingCallStatusDto: UpdateTicketingCallStatusDto,
  ): Promise<CommonResponse> {
    const ticket = await this.ticktingModel.findById(id);
    if (!ticket) {
      throw new NotFoundException(
        'Ticket Not Found',
        ErrorCode.TICKET_NOT_FOUND,
      );
    }
    const closingDescription =
      updateTicketingCallStatusDto.closingDescription || '';

    const updatedData: UpdateQuery<TicktingDocument> = {
      ...updateTicketingCallStatusDto,
      closingDescription: '',
    };

    /**
     * Handle if Ticket is assigned to another user
     */
    if (
      updateTicketingCallStatusDto?.assignedToUserId &&
      ticket?.assignedToUserId &&
      ticket?.assignedToUserId['_id'] &&
      ticket?.assignedToUserId['_id'].toString() !==
        updateTicketingCallStatusDto?.assignedToUserId
    ) {
      updatedData.$push = {
        callesAttenedByUser: {
          userId: updateTicketingCallStatusDto.assignedToUserId,
          from: new Date(),
        },
      };
    } else if (!ticket?.assignedToUserId) {
      updatedData.$push = {
        callesAttenedByUser: {
          userId: updateTicketingCallStatusDto.assignedToUserId,
          from: new Date(),
        },
      };
    }

    /**
     * If ticket is closed that update ticketClosedAt
     */
    if (
      updateTicketingCallStatusDto.callStatus === TicketingCallStatus.Closed
    ) {
      Object.assign(updatedData, {
        ticketClosedAt: new Date(),
        closingDescription,
      });
    }

    if (updatedData?.callesAttenedByUser) {
      delete updatedData?.callesAttenedByUser;
    }

    const udpatedTicket = await this.ticktingModel.findByIdAndUpdate(
      id,
      updatedData,
      {
        new: true,
      },
    );

    return { message: 'Ticket updated Successfully', data: udpatedTicket };
  }
}

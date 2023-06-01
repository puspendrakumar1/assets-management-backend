import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { FilterQuery, Model } from 'mongoose';
import { TicketingChatBy } from 'src/common/Enums';
import { UserDocument } from 'src/users/schemas/user.schema';
import { AddTicketingChatDto } from './dto/create-ticketing-chat.dto';
import {
  TicktingChat,
  TicktingChatDocument,
} from './schema/ticketing-chat.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(TicktingChat.name)
    private ticktingChatModel: Model<TicktingChatDocument>,
  ) {}

  async create(
    addTicketingChatDto: AddTicketingChatDto,
    currentUser: UserDocument,
  ) {
    const ticketChat: TicktingChatDocument = new this.ticktingChatModel({
      ...addTicketingChatDto,
      chatBy: TicketingChatBy.USER,
      messageByUser: currentUser._id,
    });
    ticketChat.save();

    return ticketChat;
  }

  async getAllChats(ticketId: string) {
    let filter: FilterQuery<TicktingChatDocument> = {
      ticket: new ObjectId(ticketId),
    };
    let ticketChats: TicktingChatDocument[] = await this.ticktingChatModel
      .aggregate([
        {
          $match: filter,
        },
      ])
      .sort({ createdAt: -1 })
      .exec();

    ticketChats = await this.ticktingChatModel.populate(ticketChats, [
      {
        path: 'messageByUser',
        select: ['firstName', 'lastName', '_id'],
      },
      {
        path: 'mentionedUsers',
        select: ['firstName', 'lastName', '_id'],
      },
    ]);

    return ticketChats;
  }

  async paginate(ticketId: string, page: number, limit: number) {
    let filter: FilterQuery<TicktingChatDocument> = {
      ticket: new ObjectId(ticketId),
    };
    let ticketChats: TicktingChatDocument[] = await this.ticktingChatModel
      .aggregate([
        {
          $match: filter,
        },
      ])
      .skip((page - 1) * +limit)
      .limit(+limit)
      .sort({ createdAt: -1 })
      .exec();

    ticketChats = await this.ticktingChatModel.populate(ticketChats, [
      {
        path: 'messageByUser',
        select: ['firstName', 'lastName', '_id', '-departmentId'],
      },
      {
        path: 'mentionedUsers',
        select: ['firstName', 'lastName', '_id', '-departmentId'],
      },
    ]);
    const total = await this.ticktingChatModel.countDocuments(filter);

    return {
      totaldata: total,
      totalPage: Math.ceil(total / limit),
      limit,
      page,
      data: ticketChats,
    };
  }
}

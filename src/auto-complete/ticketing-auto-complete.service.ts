import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Tickting,
  TicktingDocument,
} from 'src/ticketing/schemas/ticketing.schema';

@Injectable()
export class TicketingAutoCompleteService {
  constructor(
    @InjectModel(Tickting.name) private ticktingModel: Model<TicktingDocument>,
  ) {}

  async ticketingCategoryAutoComplete(searchText: string) {
    const ticketingCount = await this.ticktingModel
      .aggregate([
        {
          $match: {
            category: {
              $regex: searchText,
              $options: 'i',
            },
          },
        },
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
          },
        },
      ])
      .sort({ count: -1 })
      .limit(10);

    const autoCompleteData = ticketingCount.map((count) => count._id);
    const defaultAutoCompleteData = ['hardware', 'software'];

    return [...new Set([...autoCompleteData, ...defaultAutoCompleteData])];
  }
}

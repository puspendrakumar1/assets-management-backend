import { Injectable, NotFoundException } from '@nestjs/common';
import { CommonResponse } from '../common/interfaces';
import { CreateClientDto } from './dto/createClient.dto';
import { ErrorCode } from 'src/common/ErrorCodes';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Client, ClientDocument, ClientSchema } from './schemas/client.schema';
import { IPaginatedResponse } from 'src/common/interfaces/paginate.interface';
import { UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(Client.name)
    private clientModel: Model<ClientDocument>,
  ) {}

  async createClient(
    createClientDto: CreateClientDto,
    currentUser: UserDocument,
  ): Promise<CommonResponse> {
    const deparment = await this.clientModel.create({
      ...createClientDto,
      addedByUser: currentUser._id,
    });

    await deparment.save();
    return { message: 'Client Created Successfully', data: deparment };
  }

  async getClients(): Promise<CommonResponse<ClientDocument[]>> {
    return {
      data: await this.clientModel.find({
        isActive: true,
      }),
    };
  }

  async getClientById(id: string): Promise<ClientDocument> {
    const deparment = await this.clientModel.findById(id);
    if (!deparment) {
      throw new NotFoundException(
        'Deparment Not Found',
        ErrorCode.DEPARTMENT_NOT_FOUND,
      );
    }

    return deparment;
  }

  async updateClientById(
    id: string,
    updateClientByIdDto: CreateClientDto,
  ): Promise<ClientDocument> {
    await this.clientModel.findByIdAndUpdate(id, {
      ...updateClientByIdDto,
    });

    return this.getClientById(id);
  }

  async deleteClient(id: string): Promise<ClientDocument> {
    await this.clientModel.findByIdAndUpdate(id, {
      isActive: false,
    });

    return this.getClientById(id);
  }

  async getClientByName(name: string) {
    return this.clientModel.findOne({
      name,
    });
  }

  async paginate(query: any): Promise<IPaginatedResponse<ClientDocument>> {
    let filter: FilterQuery<ClientDocument> = { $or: [], $and: [] };
    const fieldData = [];
    let paths = ClientSchema['paths'];

    const schemaFields = Object.keys(ClientSchema['paths']);
    schemaFields.forEach((field) => {
      if (paths[field]['instance'] === 'String') {
        fieldData.push(paths[field]);
      }
    });

    const filterFields = fieldData.map((fData) => fData.path);

    for (const key in query) {
      if (!['limit', 'page', 'searchText'].includes(key)) {
        filter.$and.push({
          [key]: {
            $regex: query[key],
            $options: 'i',
          },
        });
      }
    }
    filterFields.forEach((key) => {
      if (!['_id', '__v'].includes(key)) {
        filter.$or.push({
          [key]: {
            $regex: query['searchText'] || '',
            $options: 'i',
          },
        });
      }
    });

    if (!filter.$or.length) {
      delete filter.$or;
    }
    if (!filter.$and.length) {
      delete filter.$and;
    }

    const total = await this.clientModel.countDocuments(filter);
    const data = await this.clientModel
      .find(filter)
      .skip(((query.page || 1) - 1) * (+query.limit || 10))

      .limit(+query.limit || 10)
      .sort({ createdAt: -1 })
      .exec();

    return {
      limit: +query.limit || 10,
      page: +query.page || 1,
      totalPage: Math.ceil(total / query.limit) || 0,
      totaldata: total,
      data,
    };
  }
}

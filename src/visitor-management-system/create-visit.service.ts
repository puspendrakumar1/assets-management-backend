import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from 'src/users/schemas/user.schema';
import { CreateVisitDTO } from './dto/create-visit.dto';
import { Visitor, VisitorDocument } from './schema/visitor.schema';

@Injectable()
export class CreateVisitService {
  constructor(
    @InjectModel(Visitor.name) private visitorModel: Model<VisitorDocument>,
  ) {}

  async createVisit(createVisitDTO: CreateVisitDTO, currentUser: UserDocument) {
    const visitor = await this.visitorModel.create({
      ...createVisitDTO,
      createdBy: currentUser._id,
    });

    await visitor.save();
    return { message: 'Vendor Created Successfully', data: visitor };
  }
}

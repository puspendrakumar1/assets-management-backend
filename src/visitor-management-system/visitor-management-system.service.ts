import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import moment from 'moment';
import { Model } from 'mongoose';
import { ErrorCode } from 'src/common/ErrorCodes';
import { UserDocument } from 'src/users/schemas/user.schema';
import { Visitor, VisitorDocument } from './schema/visitor.schema';
import { VMSPopulateFields } from './utils/visitor-management-system-populate.util';

@Injectable()
export class VisitorManagementSystemService {
  constructor(
    @InjectModel(Visitor.name) private visitorModel: Model<VisitorDocument>,
  ) {}

  async checkInVisitor(id: string, currentUser: UserDocument) {
    const visit = await this.visitorModel.findById(id);
    if (!visit) {
      throw new NotFoundException('Visit not Found', ErrorCode.VISIT_NOT_FOUND);
    }
    if (visit.checkInCreatedBy) {
      throw new BadRequestException(
        'Already Checked In',
        ErrorCode.ALREADY_CHECKED_IN,
      );
    }

    const updatedVisit = await this.visitorModel.findOneAndUpdate(
      {
        _id: id,
      },
      {
        actualVisitFromDateTime: new Date(),
        checkInCreatedBy: currentUser._id,
      },
      {
        new: true,
      },
    );

    return {
      data: await this.visitorModel.populate(updatedVisit, VMSPopulateFields),
    };
  }
  async checkOutVisitor(id: string, currentUser: UserDocument) {
    const visit = await this.visitorModel.findById(id);
    if (!visit) {
      throw new NotFoundException('Visit not Found', ErrorCode.VISIT_NOT_FOUND);
    }
    if (visit.checkOutCreatedBy) {
      throw new BadRequestException(
        'Already Checked Out',
        ErrorCode.ALREADY_CHECKED_OUT,
      );
    }
    if (!visit.actualVisitFromDateTime) {
      throw new BadRequestException(
        'Check in Not Found',
        ErrorCode.CHECKIN_NOT_FOUND,
      );
    }

    const updatedVisit = await this.visitorModel.findOneAndUpdate(
      {
        _id: id,
      },
      {
        actualVisitToDateTime: new Date(),
        checkOutCreatedBy: currentUser._id,
      },
      {
        new: true,
      },
    );

    return {
      data: await this.visitorModel.populate(updatedVisit, VMSPopulateFields),
    };
  }
}

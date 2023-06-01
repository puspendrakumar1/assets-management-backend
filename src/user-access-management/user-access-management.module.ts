import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NodemailerModule } from 'src/nodemailer/nodemailer.module';
import { GenerateUserAccessManagementPDFService } from './generate-user-access-management-pdf.service';
import {
  UserAccessManagementSchema,
  UserAccessManagement,
} from './schemas/user-access-management.schema';
import { PaginateUserAccessManagementService } from './user-access-management-paginate.service';
import { UserAccessManagementController } from './user-access-management.controller';
import { UserAccessManagementService } from './user-access-management.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserAccessManagement.name, schema: UserAccessManagementSchema },
    ]),
    NodemailerModule,
  ],
  controllers: [UserAccessManagementController],
  providers: [
    UserAccessManagementService,
    PaginateUserAccessManagementService,
    GenerateUserAccessManagementPDFService,
  ],
})
export class UserAccessManagementModule {}

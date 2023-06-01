import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { TicketingModule } from 'src/ticketing/ticketing.module';
import { AssetModule } from 'src/asset/asset.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Asset, AssetSchema } from 'src/asset/schemas/asset.schema';
import { Branch, BranchSchema } from 'src/branch/schemas/branch.schema';
import { ITUserDashboardService } from './it-user-dashboard.service';
import {
  Tickting,
  TicktingSchema,
} from 'src/ticketing/schemas/ticketing.schema';
import { UsersDashboardService } from './users-dashboard.service';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import {
  UserAccessManagement,
  UserAccessManagementSchema,
} from 'src/user-access-management/schemas/user-access-management.schema';
import { UAMDashboardService } from './uam-dashboard.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Asset.name, schema: AssetSchema },
      { name: Branch.name, schema: BranchSchema },
      { name: Tickting.name, schema: TicktingSchema },
      { name: User.name, schema: UserSchema },
      { name: UserAccessManagement.name, schema: UserAccessManagementSchema },
    ]),
    TicketingModule,
    AssetModule,
  ],
  providers: [
    DashboardService,
    ITUserDashboardService,
    UsersDashboardService,
    UAMDashboardService,
  ],
  controllers: [DashboardController],
})
export class DashboardModule {}

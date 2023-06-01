import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CreateVisitService } from './create-visit.service';
import { PaginateVisitService } from './paginate-visit.service';
import { Visitor, VisitorSchema } from './schema/visitor.schema';

import { VisitorManagementSystemController } from './visitor-management-system.controller';
import { VisitorManagementSystemService } from './visitor-management-system.service';
import { VisitorManagementSystemDashboardService } from './vms-dashboard.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Visitor.name, schema: VisitorSchema }]),
  ],
  providers: [
    CreateVisitService,
    PaginateVisitService,
    VisitorManagementSystemService,
    VisitorManagementSystemDashboardService,
  ],
  controllers: [VisitorManagementSystemController],
})
export class VisitorManagementSystemModule {}

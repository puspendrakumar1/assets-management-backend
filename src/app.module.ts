import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { JwtModule } from '@nestjs/jwt';
import { VendorModule } from './vendor/vendor.module';
import { AssetModule } from './asset/asset.module';
import { DepartmentModule } from './department/department.module';
import { JwtStrategy } from './auth/strategy/jwt.strategy';
import { JWT_SECRET, MONGODB_URI } from './environment';
import { MongooseModule } from '@nestjs/mongoose';
import { SideBarModule } from './side-bar/side-bar.module';
import { TicketingModule } from './ticketing/ticketing.module';
// import { ActiveDirectoryModule } from './active-directory/active-directory.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ProductPresetsModule } from './product-presets/product-presets.module';
import { AllocationFormModule } from './allocation-form/allocation-form.module';
import { ClientModule } from './client/client.module';
import { BranchModule } from './branch/branch.module';
import { ExeAgentModule } from './exe-agent/exe-agent.module';
import { AutoCompleteModule } from './auto-complete/auto-complete.module';
import { UserAccessManagementModule } from './user-access-management/user-access-management.module';
import { NodemailerModule } from './nodemailer/nodemailer.module';
import { VisitorManagementSystemModule } from './visitor-management-system/visitor-management-system.module';

@Module({
  imports: [
    CommonModule,
    MongooseModule.forRoot(MONGODB_URI, {
      connectionFactory: (connection) => {
        connection.plugin(require('mongoose-autopopulate'));
        return connection;
      },
    }),

    UsersModule,
    AuthModule,
    VendorModule,
    AssetModule,
    DepartmentModule,
    SideBarModule,
    TicketingModule,
    // ActiveDirectoryModule,
    DashboardModule,
    ProductPresetsModule,
    AllocationFormModule,
    ClientModule,
    BranchModule,
    ExeAgentModule,
    AutoCompleteModule,
    UserAccessManagementModule,
    NodemailerModule,
    VisitorManagementSystemModule,
    // ReportsModule,
    // AuditModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}

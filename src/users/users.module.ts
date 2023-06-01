import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DepartmentModule } from 'src/department/department.module';
import { DefaultUserService } from './default-user.service';
import { User, UserSchema } from './schemas/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    DepartmentModule,
  ],
  providers: [UsersService, DefaultUserService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}

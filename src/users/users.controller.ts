import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { IdDto } from '../dtos/id.dto';
import { CommonResponse } from '../common/interfaces';
import { UsersService } from './users.service';

import { RolesGuard } from '../common/Guards/roles.guards';
import { Roles } from '../common/Decorators/role.decorator';
import { UserRole } from '../common/Enums';
import { JwtAuthGuard } from 'src/common/Guards/jwt-auth.guard';
import { User, UserDocument } from './schemas/user.schema';
import { IPaginatedResponse } from 'src/common/interfaces/paginate.interface';
import { EditUserDto } from './dtos/edit-user.dto';
import { CurrentUser } from 'src/common/Decorators/current-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  @Roles(UserRole.LEVEL1, UserRole.LEVEL2)
  async getUsers(): Promise<CommonResponse<User[]>> {
    const users = await this.usersService.getUsers();

    return {
      data: users,
    };
  }

  @Get('paginate')
  @Roles(UserRole.LEVEL1, UserRole.LEVEL2)
  async paginate(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('searchText') searchText: string = '',
  ): Promise<IPaginatedResponse<User>> {
    return this.usersService.paginate({
      limit,
      page,
      searchText,
    });
  }

  @Get('dropdown-list')
  async getUsersForDropdown() {
    return {
      data: await this.usersService.getUsersForDropDown(),
    };
  }

  @Get('current-user')
  async getCurrentUser(@CurrentUser() currentUser: UserDocument) {
    return {
      data: currentUser,
    };
  }

  @Get('register-user-fields')
  @Roles(UserRole.LEVEL1, UserRole.LEVEL2)
  async getRegisterUserFields() {
    return {
      data: await this.usersService.getRegisterUserFields(),
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.LEVEL1, UserRole.LEVEL2, UserRole.LEVEL3)
  async getUserById(
    @Param() params: IdDto,
    @CurrentUser() currentUser: UserDocument,
  ): Promise<CommonResponse<User>> {
    const user = await this.usersService.findById(params.id, currentUser);
    delete user.password;

    return {
      data: user,
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.LEVEL1, UserRole.LEVEL2, UserRole.LEVEL3)
  async editUserById(
    @Param() params: IdDto,
    @Body() editUserDto: EditUserDto,
    @CurrentUser() currentUser: UserDocument,
  ) {
    return this.usersService.updateById(params.id, editUserDto, currentUser);
  }
}

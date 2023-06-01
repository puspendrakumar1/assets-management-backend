import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { IdDto } from 'src/dtos/id.dto';
import { CommonResponse } from '../common/interfaces';
import { CreateBranchDto } from './dto/createBranch.dto';
import { BranchService } from './branch.service';
import { UpdateBranchDto } from './dto/updateBranch.dto';
import { BranchDocument } from './schemas/branch.schema';
import { CurrentUser } from 'src/common/Decorators/current-user.decorator';
import { UserDocument } from 'src/users/schemas/user.schema';
import { JwtAuthGuard } from 'src/common/Guards/jwt-auth.guard';
import { IPaginatedResponse } from 'src/common/interfaces/paginate.interface';
import { Permissions } from 'src/common/Decorators/permissions.decorator';
import { UserPermissions } from 'src/common/Enums';
import { PermissionGuard } from 'src/common/Guards/premission.guard';

@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('branch')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @Permissions(UserPermissions.BranchCreate)
  async createBranch(
    @Body() createBranchDto: CreateBranchDto,
    @CurrentUser() currentUser: UserDocument,
  ): Promise<CommonResponse> {
    return this.branchService.createBranch(createBranchDto, currentUser);
  }

  @Get()
  // @Permissions(UserPermissions.BranchView)
  async getBranchs(): Promise<CommonResponse<BranchDocument[]>> {
    return this.branchService.getBranchs();
  }

  @Get('paginate')
  // @Permissions(UserPermissions.BranchView)
  async paginate(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Query('searchText') searchText: string = '',
  ): Promise<IPaginatedResponse<BranchDocument>> {
    return this.branchService.paginate({
      page,
      limit,
      searchText,
    });
  }

  @Get(':id')
  // @Permissions(UserPermissions.BranchView)
  async getBranchById(
    @Param() params: IdDto,
  ): Promise<CommonResponse<BranchDocument>> {
    return {
      data: await this.branchService.getBranchById(params.id),
    };
  }
  @Put(':id')
  @Permissions(UserPermissions.BranchUpdate)
  async updateBranchById(
    @Param() params: IdDto,
    @Body() updateBranchByIdDto: UpdateBranchDto,
  ): Promise<CommonResponse<BranchDocument>> {
    return {
      message: 'Branch Updated Successfully',
      data: await this.branchService.updateBranchById(
        params.id,
        updateBranchByIdDto,
      ),
    };
  }
  @Delete(':id')
  @Permissions(UserPermissions.BranchDelete)
  async deleteBranch(
    @Param() params: IdDto,
  ): Promise<CommonResponse<BranchDocument>> {
    return {
      message: 'Branch Delelted Successfully',
      data: await this.branchService.deleteBranch(params.id),
    };
  }
}

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
} from '@nestjs/common';
import { IdDto } from '../dtos/id.dto';
import { CommonResponse } from '../common/interfaces';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/createDepartment.dto';
import { DepartmentDocument } from './schemas/department.schema';
import { UserPermissions, UserRole } from 'src/common/Enums';
import { Roles } from 'src/common/Decorators/role.decorator';
import { Permissions } from 'src/common/Decorators/permissions.decorator';
import { JwtAuthGuard } from 'src/common/Guards/jwt-auth.guard';
import { PermissionGuard } from 'src/common/Guards/premission.guard';
import { RolesGuard } from 'src/common/Guards/roles.guards';

@UseGuards(JwtAuthGuard, RolesGuard, PermissionGuard)
@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post()
  @Roles(UserRole.LEVEL1)
  @HttpCode(HttpStatus.OK)
  @Permissions(UserPermissions.DepartmentCreate)
  async createDepartment(
    @Body() createDepartmentDto: CreateDepartmentDto,
  ): Promise<CommonResponse> {
    return this.departmentService.createDepartment(createDepartmentDto);
  }

  @Get()
  @Roles(UserRole.LEVEL1, UserRole.LEVEL2)
  // @Permissions(UserPermissions.DepartmentView)
  async getDepartments(): Promise<CommonResponse<DepartmentDocument[]>> {
    return this.departmentService.getDepartments();
  }

  @Get(':id')
  @Roles(UserRole.LEVEL1, UserRole.LEVEL2)
  // @Permissions(UserPermissions.DepartmentView)
  async getDepartmentById(
    @Param() params: IdDto,
  ): Promise<CommonResponse<DepartmentDocument>> {
    return {
      data: await this.departmentService.getDepartmentById(params.id),
    };
  }

  @Put(':id')
  @Roles(UserRole.LEVEL1, UserRole.LEVEL2)
  @Permissions(UserPermissions.DepartmentUpdate)
  async updateDepartmentById(
    @Param() params: IdDto,
    @Body() updateDepartmentByIdDto: CreateDepartmentDto,
  ): Promise<CommonResponse<DepartmentDocument>> {
    return {
      message: 'Department Updated Successfully',
      data: await this.departmentService.updateDepartmentById(
        params.id,
        updateDepartmentByIdDto,
      ),
    };
  }

  @Delete(':id')
  @Roles(UserRole.LEVEL1)
  @Permissions(UserPermissions.DepartmentDelete)
  async deleteDepartment(
    @Param() params: IdDto,
  ): Promise<CommonResponse<DepartmentDocument>> {
    return {
      message: 'Department Delelted Successfully',
      data: await this.departmentService.deleteDepartment(params.id),
    };
  }
}

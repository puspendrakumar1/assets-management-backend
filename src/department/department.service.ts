import { Injectable, NotFoundException } from '@nestjs/common';
import { CommonResponse } from '../common/interfaces';
import { CreateDepartmentDto } from './dto/createDepartment.dto';
import { ErrorCode } from 'src/common/ErrorCodes';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Department, DepartmentDocument } from './schemas/department.schema';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectModel(Department.name)
    private departmentModel: Model<DepartmentDocument>,
  ) {}

  async createDepartment(
    createDepartmentDto: CreateDepartmentDto,
  ): Promise<CommonResponse> {
    const deparment = await this.departmentModel.create({
      ...createDepartmentDto,
    });

    await deparment.save();
    return { message: 'Department Created Successfully', data: deparment };
  }

  async getDepartments(): Promise<CommonResponse<DepartmentDocument[]>> {
    return {
      data: await this.departmentModel.find({
        isActive: true,
      }),
    };
  }

  async getDepartmentById(id: string): Promise<DepartmentDocument> {
    const deparment = await this.departmentModel.findById(id);
    if (!deparment) {
      throw new NotFoundException(
        'Deparment Not Found',
        ErrorCode.DEPARTMENT_NOT_FOUND,
      );
    }

    return deparment;
  }

  async updateDepartmentById(
    id: string,
    updateDepartmentByIdDto: CreateDepartmentDto,
  ): Promise<DepartmentDocument> {
    await this.departmentModel.findByIdAndUpdate(id, {
      ...updateDepartmentByIdDto,
    });

    return this.getDepartmentById(id);
  }

  async deleteDepartment(id: string): Promise<DepartmentDocument> {
    await this.departmentModel.findByIdAndUpdate(id, {
      isActive: false,
    });

    return this.getDepartmentById(id);
  }

  async getDepartmentByName(name: string) {
    return this.departmentModel.findOne({
      name,
    });
  }
}

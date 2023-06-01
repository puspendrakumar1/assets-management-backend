import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { User, UserDocument, UserSchema } from './schemas/user.schema';
import { IPaginatedResponse } from 'src/common/interfaces/paginate.interface';
import { RegisterUserFields } from './types/register-user-fields-type';
import { FieldDataType, FieldType, UserRole } from 'src/common/Enums';
import { DepartmentService } from 'src/department/department.service';
import { isMongoId } from 'class-validator';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly departmentService: DepartmentService,
  ) {}

  async findById(id: string, currentUser: UserDocument): Promise<UserDocument> {
    if (currentUser && currentUser.role === UserRole.LEVEL3) {
      id = currentUser._id;
    }

    return this.userModel
      .findById(id)
      .select({
        password: 0,
      })
      .populate('manager branch departmentId');
  }
  async findByEmail(
    email: string,
    getPassword: boolean = false,
  ): Promise<UserDocument> {
    return this.userModel
      .findOne({ email })
      .select(`-branch ${getPassword ? '' : '-password'}`);
  }
  async insert(user: any): Promise<any> {
    user.password = await bcrypt.hash(user.password, 5);
    return this.userModel.insertMany([user]);
  }
  async getUsers() {
    return this.userModel.find().select('-password');
  }
  async updateById(id: string, updateData: any, currentUser: UserDocument) {
    if (currentUser && currentUser.role === UserRole.LEVEL3) {
      id = currentUser._id;
    }

    if (updateData.departmentId && !isMongoId(updateData.departmentId)) {
      const department = await this.departmentService.getDepartmentByName(
        updateData.departmentId,
      );
      if (department) {
        updateData.departmentId = department._id;
      } else {
        updateData.departmentId = null;
      }
    }

    return this.userModel.findOneAndUpdate(
      {
        _id: id,
      },
      updateData,
    );
  }
  async paginate(query: any): Promise<IPaginatedResponse<User>> {
    let filter: FilterQuery<UserDocument> = { $or: [], $and: [] };
    const fieldData = [];
    let paths = UserSchema['paths'];

    const schemaFields = Object.keys(UserSchema['paths']);
    schemaFields.forEach((field) => {
      if (paths[field]['instance'] === 'String') {
        fieldData.push(paths[field]);
      }
    });

    const filterFields = fieldData.map((fData) => fData.path);

    for (const key in query) {
      if (!['limit', 'page', 'searchText'].includes(key)) {
        if (query[key]) {
          filter.$and.push({
            [key]: {
              $regex: query[key],
              $options: 'i',
            },
          });
        }
      }
    }

    if (query['searchText']) {
      filterFields.forEach((key) => {
        if (!['_id', '__v'].includes(key)) {
          filter.$or.push({
            [key]: {
              $regex: query['searchText'] || '',
              $options: 'i',
            },
          });
        }
      });
    }

    if (!filter.$or.length) {
      delete filter.$or;
    }
    if (!filter.$and.length) {
      delete filter.$and;
    }

    const total = await this.userModel.countDocuments(filter);
    let data = await this.userModel
      .aggregate([{ $match: filter }])
      .skip((query.page - 1) * +query.limit)
      .limit(+query.limit)
      .sort({ createdAt: -1 })
      .project({
        password: 0,
      })
      .exec();
    data = await this.userModel.populate(data, [
      {
        path: 'branch',
        select: {
          createdBy: 0,
        },
      },
      {
        path: 'departmentId',
      },
      {
        path: 'manager',
        select: {
          permissions: 0,
          password: 0,
        },
      },
    ]);

    return {
      limit: +query.limit,
      page: +query.page,
      totalPage: Math.ceil(total / query.limit),
      totaldata: total,
      data,
    };
  }

  async getUsersForDropDown() {
    const users = await this.userModel.find().select('_id firstName lastName');

    const dropdownUsers = {};
    users.forEach((user) => {
      Object.assign(dropdownUsers, {
        [user._id]: `${user.firstName} ${user.lastName}`,
      });
    });

    return dropdownUsers;
  }

  async getAllUsersBasicDetails() {
    return this.userModel
      .find()
      .select('_id firstName lastName email departmentId');
  }

  async addAssetIdToUser(userId: string, assetId: string) {
    return this.userModel.findOneAndUpdate(
      {
        _id: userId,
      },
      {
        $push: { allocatedAssets: [assetId] },
      },
    );
  }
  async removeAssetFromUser(userId: string | UserDocument, assetId: string) {
    if (userId && assetId && typeof userId !== 'string' && userId._id) {
      return this.userModel.findOneAndUpdate(
        {
          _id: typeof userId === 'string' ? userId : userId._id,
        },
        {
          $pull: { allocatedAssets: assetId },
        },
      );
    }
  }

  async getRegisterUserFields() {
    const departmentsResponse = await this.departmentService.getDepartments();
    const departments = {};

    departmentsResponse.data.forEach((department) => {
      Object.assign(departments, {
        [department._id]: department.name,
      });
    });

    return {
      registerUserFields: [
        ...RegisterUserFields,
        {
          label: 'Role',
          fieldName: 'role',
          type: FieldType.DROPDOWN,
          dataType: FieldDataType.STRING,
          values: {
            [UserRole.LEVEL2]: 'Admin',
            [UserRole.LEVEL3]: 'Employee',
          },
        },
        {
          label: 'Department',
          fieldName: 'departmentId',
          type: FieldType.DROPDOWN,
          dataType: FieldDataType.STRING,
          values: departments,
        },
      ],
    };
  }
}

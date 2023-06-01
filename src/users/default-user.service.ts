import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';

import { DEFAULT_USER_EMAIL, DEFAULT_USER_PASSWORD } from 'src/environment';
import { User, UserDocument } from './schemas/user.schema';
import { UserPermissions, UserRole } from 'src/common/Enums';

@Injectable()
export class DefaultUserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    this.createDefaultUserIfNotExists();
  }

  async createDefaultUserIfNotExists() {
    const email = DEFAULT_USER_EMAIL
      ? DEFAULT_USER_EMAIL.toLowerCase()
      : 'admin@admin.com';
    const user = await this.userModel.findOne({
      email,
    });
    if (!user) {
      this.userModel.create({
        email,
        password: DEFAULT_USER_PASSWORD
          ? await bcrypt.hash(DEFAULT_USER_PASSWORD, 5)
          : await bcrypt.hash('Test@12345', 5),
        role: UserRole.LEVEL1,
        permissions: Object.keys(UserPermissions),
        firstName: 'Admin',
        lastName: 'Admin',
        passwordChangedAt: [new Date()],
      });
      Logger.log('Default user created.');
    }
  }
}

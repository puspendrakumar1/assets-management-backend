import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ErrorCode } from '../common/ErrorCodes';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import * as bcrypt from 'bcryptjs';
import { ResetPasswordDto } from './dto/resetPasswordDto.dto';
import { isMongoId } from 'class-validator';
import { DepartmentService } from 'src/department/department.service';
import { UserDocument } from 'src/users/schemas/user.schema';
import { UserPermissions, UserRole } from 'src/common/Enums';
import * as moment from 'moment';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly departmentService: DepartmentService,
  ) {}
  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email, true);
    if (!user) {
      throw new NotFoundException('User not found', ErrorCode.USER_NOT_FOUND);
    }
    const comparePassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!comparePassword) {
      throw new UnauthorizedException(
        'Incorrect Password',
        ErrorCode.INCORRECT_PASSWORD,
      );
    }

    user.password = undefined;
    return {
      message: 'Sucessfull',
      data: {
        accessToken: this.jwtService.sign({
          userId: user.id,
          email: user.email,
        }),
        user,
      },
    };
  }

  async signUp(signUpDto: SignUpDto, currentUser: UserDocument) {
    /**
     * If Current user is Level2 then can not create Level1 or Level2 user
     */
    if (
      currentUser.role === UserRole.LEVEL2 &&
      (signUpDto.role === UserRole.LEVEL1 || signUpDto.role === UserRole.LEVEL2)
    ) {
      throw new BadRequestException(
        'You do not have permission to create this type of User',
        ErrorCode.PERMISSION_DENIED,
      );
    }
    if (currentUser.role === UserRole.LEVEL2) {
      delete signUpDto.permissions;
    }

    const user = await this.usersService.findByEmail(signUpDto.email);
    if (user) {
      throw new BadRequestException(
        'User Already Exists',
        ErrorCode.USER_ALREADY_EXISTS,
      );
    }
    signUpDto.password = 'Test@12345';

    if (!isMongoId(signUpDto.departmentId)) {
      const departmentResposne = await this.departmentService.createDepartment({
        name: signUpDto.departmentId,
      });
      signUpDto.departmentId = departmentResposne.data._id;
    }

    if (signUpDto.role === UserRole.LEVEL1) {
      signUpDto.permissions = Object.keys(UserPermissions);
    }
    if (signUpDto.role === UserRole.LEVEL3) {
      signUpDto.permissions = [
        'UAMCreate',
        'UAMView',
        'UAMUpdate',
        'TicketCreate',
        'TicketView',
        'TicketUpdate',
        'AssetView',
      ];
    }

    await this.usersService.insert({
      firstName: signUpDto.firstName,
      lastName: signUpDto.lastName,
      email: signUpDto.email.toLowerCase(),
      password: signUpDto.password,
      role: signUpDto.role,
      departmentId: signUpDto.departmentId,
      branch: signUpDto.branch,
      manager: signUpDto.manager,
      mobileNumber: signUpDto.mobileNumber,
      permissions: signUpDto.permissions,
      passwordChangedAt: [new Date()],
    });
    return this.login({ email: signUpDto.email, password: signUpDto.password });
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.usersService.findById(resetPasswordDto.id, null);
    if (!user) {
      throw new NotFoundException('User Not Found', ErrorCode.USER_NOT_FOUND);
    }
    const password = await bcrypt.hash(resetPasswordDto.password, 5);
    await this.usersService.updateById(
      user._id,
      {
        password,
        passwordChangedAt: user.passwordChangedAt
          ? [...user.passwordChangedAt, new Date()]
          : [new Date()],
      },
      null,
    );
  }
}

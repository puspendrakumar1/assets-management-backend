import {
  Controller,
  Post,
  HttpStatus,
  HttpCode,
  Body,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/common/Decorators/current-user.decorator';
import { UserDocument } from 'src/users/schemas/user.schema';
import { Roles } from '../common/Decorators/role.decorator';
import { UserRole } from '../common/Enums';
import { JwtAuthGuard } from '../common/Guards/jwt-auth.guard';
import { RolesGuard } from '../common/Guards/roles.guards';
import { CommonResponse } from '../common/interfaces';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/resetPasswordDto.dto';
import { SignUpDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<
    CommonResponse<{
      accessToken: string;
      user: any;
    }>
  > {
    return this.authService.login(loginDto);
  }

  @Post('sign-up')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.LEVEL1)
  @HttpCode(HttpStatus.OK)
  async signUp(
    @Body() signUpDto: SignUpDto,
    @CurrentUser() currentUser: UserDocument,
  ): Promise<
    CommonResponse<{
      accessToken: string;
      user: any;
    }>
  > {
    return this.authService.signUp(signUpDto, currentUser);
  }

  @Put('reset-password')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.LEVEL1, UserRole.LEVEL2)
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<CommonResponse> {
    await this.authService.resetPassword(resetPasswordDto);

    return {
      message: 'Password Reset Successfully',
    };
  }
}

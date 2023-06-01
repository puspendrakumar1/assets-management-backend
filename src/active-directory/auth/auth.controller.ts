import {
  Controller,
  Post,
  HttpStatus,
  HttpCode,
  Body,
} from '@nestjs/common';
import { CommonResponse } from 'src/common/interfaces';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

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

}

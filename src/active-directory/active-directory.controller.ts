import { Body, Controller, Post, Get } from '@nestjs/common';
import { LoginDto } from './auth/dto/login.dto';
import { ActiveDirectoryService } from './active-directory.service';
import { AuthService } from './auth/auth.service';

@Controller('active-directory')
export class ActiveDirectoryController {
  constructor(
    private readonly activeDirectoryService: ActiveDirectoryService,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('users')
  async getAllUsers() {
    const users: any = await this.activeDirectoryService.getAllADUsers()
    return {
      data: users.filter(user => user.mail)
    };
  }

  @Get('users/dropdown-list')
  async getUsersForDropdown() {
    return {
      data: await this.activeDirectoryService.getADUsersForDropDown(),
    };
  }
}

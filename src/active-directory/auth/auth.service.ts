import {
  Injectable,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ActiveDirectoryService } from '../active-directory.service';
import IAdPayload from './interface/payload.interface';
import { encode } from 'src/common/utils/crypto.util';
import { IADUser } from './interface/ad-user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly activeDirectoryService: ActiveDirectoryService
  ) { }
  async login(loginDto: LoginDto) {
    const user: IADUser = await this.activeDirectoryService.authenticateUser(loginDto.username, loginDto.password);
    const jwtPayload: IAdPayload = {
      credential: encode(JSON.stringify(loginDto)),
    }

    return {
      message: 'Sucessfull',
      data: {
        accessToken: this.jwtService.sign(jwtPayload),
        user,
      },
    };
  }

}

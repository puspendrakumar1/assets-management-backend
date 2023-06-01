import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserDocument } from 'src/users/schemas/user.schema';
import { ErrorCode } from 'src/common/ErrorCodes';
import IAdPayload from '../interface/payload.interface';
import { ActiveDirectoryService } from 'src/active-directory/active-directory.service';
import { LoginDto } from '../dto/login.dto';
import { decode } from 'src/common/utils/crypto.util';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-ad') {
  constructor(private readonly activeDirectoryService: ActiveDirectoryService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'JWT_SECRET',
    });
  }

  async validate(payload: IAdPayload): Promise<any> {
    const loginCreds: LoginDto = JSON.parse(decode(payload.credential))
    
    const isCredentialValid = await this.activeDirectoryService.validate(loginCreds.username, loginCreds.password)

    if (!isCredentialValid) {
      throw new UnauthorizedException('Invalid Credentials', ErrorCode.UNAUTHORIZED)
    }
    
    return this.activeDirectoryService.findUserByUsername(loginCreds.username);
  }
}

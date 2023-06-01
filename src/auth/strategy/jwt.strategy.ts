import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ErrorCode } from '../../common/ErrorCodes';
import { IPayload } from '../interface';
import { UsersService } from 'src/users/users.service';
import { UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'JWT_SECRET',
    });
  }

  async validate(payload: IPayload): Promise<UserDocument> {
    const user = await this.usersService.findById(payload.userId, null);
    if (!user || !user.isActive) {
      throw new UnauthorizedException(
        'You are not authorized to access',
        ErrorCode.UNAUTHORIZED,
      );
    }
    delete user.password;

    return user;
  }
}

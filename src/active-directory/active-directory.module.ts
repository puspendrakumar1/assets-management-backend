import { Module } from '@nestjs/common';
import { ActiveDirectoryService } from './active-directory.service';
import { ActiveDirectoryController } from './active-directory.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { JwtStrategy } from './auth/strategy/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'JWT_SECRET',
      verifyOptions: {
        algorithms: ['HS256'],
      },
      // signOptions: {
      //   expiresIn: '365d',
      // },
    }),
  ],
  providers: [ActiveDirectoryService, AuthService,JwtStrategy],
  controllers: [ActiveDirectoryController, AuthController],
  exports: [PassportModule, JwtStrategy, JwtModule,ActiveDirectoryService],
})
export class ActiveDirectoryModule {}

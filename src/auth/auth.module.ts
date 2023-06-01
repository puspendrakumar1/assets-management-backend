import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DepartmentModule } from 'src/department/department.module';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    DepartmentModule,
    JwtModule.register({
      secret: 'JWT_SECRET',
      verifyOptions: {
        algorithms: ['HS256'],
      },
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [PassportModule, JwtStrategy, JwtModule],
})
export class AuthModule {}

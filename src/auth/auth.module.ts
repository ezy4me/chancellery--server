import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '@user/user.module';
import { options } from './config';
import { STRATEGIES } from './strategies';
import { GUARDS } from './guards';
import { UserService } from '@user/user.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  providers: [AuthService, ...STRATEGIES, ...GUARDS, UserService],
  controllers: [AuthController],
  imports: [
    PassportModule,
    JwtModule.registerAsync(options()),
    UserModule,
    CacheModule.register(),
  ],
})
export class AuthModule {}

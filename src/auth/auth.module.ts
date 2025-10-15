import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
// import { AuthGuard } from './auth.guard';
// import { RolesGuard } from './roles.guard';
// import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // <-- add this
  ],
  providers: [
    AuthService,
    // Global authguard
    // { provide: APP_GUARD, useClass: AuthGuard },
    // If you want RolesGuard global as well (it will only block routes that have roles metadata)
    // { provide: APP_GUARD, useClass: RolesGuard },
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}

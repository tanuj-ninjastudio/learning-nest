import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AuthModule } from 'src/auth/auth.module';
import { AuthGuard } from 'src/auth/auth.guard';
import { AdminService } from './admin.service';

@Module({
  imports: [AuthModule],
  providers: [AuthGuard, AdminService],
  controllers: [AdminController],
})
export class AdminModule {}

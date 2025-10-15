import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AdminService {
  constructor(private authService: AuthService) {}
  getDashboardData() {
    return { message: 'Welcome, Admin! Secure dashboard data here.' };
  }
}

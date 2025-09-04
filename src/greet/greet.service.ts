import { Injectable } from '@nestjs/common';

@Injectable()
export class GreetService {
  getGreeting(name: string): string {
    return `Hello ${name || 'Guest'}, Welcome to learning Nest`;
  }
}

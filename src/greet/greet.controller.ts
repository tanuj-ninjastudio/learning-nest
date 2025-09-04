import { Controller, Get, Param, Query } from '@nestjs/common';
import { GreetService } from './greet.service';

@Controller('greet')
export class GreetController {
  constructor(private readonly greetService: GreetService) {}

  // for query params we use @Query
  @Get()
  sayHello(@Query('name') name: string): string {
    return this.greetService.getGreeting(name);
  }

  // for route params we use @Param
  @Get(':name')
  sayHi(@Param('name') name: string): string {
    return this.greetService.getGreeting(name);
  }
}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HelloController } from './hello/hello.controller';
import { GreetService } from './greet/greet.service';
import { GreetController } from './greet/greet.controller';
import { UserModule } from './user/user.module';
import { BookModule } from './book/book.module';

@Module({
  imports: [UserModule, BookModule],
  controllers: [AppController, HelloController, GreetController],
  providers: [AppService, GreetService],
})
export class AppModule {}

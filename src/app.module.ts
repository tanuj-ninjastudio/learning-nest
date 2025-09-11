import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HelloController } from './hello/hello.controller';
import { GreetService } from './greet/greet.service';
import { GreetController } from './greet/greet.controller';
import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';
import { NotesModule } from './notes/notes.module';

@Module({
  imports: [UsersModule, BooksModule, NotesModule],
  controllers: [AppController, HelloController, GreetController],
  providers: [AppService, GreetService],
})
export class AppModule {}

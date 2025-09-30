import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HelloController } from './hello/hello.controller';
import { GreetService } from './greet/greet.service';
import { GreetController } from './greet/greet.controller';
import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';
import { NotesModule } from './notes/notes.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    UsersModule,
    BooksModule,
    NotesModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Database connection using .env
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: false, // auto sync schema (disable in production!)
      }),
    }),

    TasksModule,
  ],
  controllers: [AppController, HelloController, GreetController],
  providers: [AppService, GreetService],
})
export class AppModule {}

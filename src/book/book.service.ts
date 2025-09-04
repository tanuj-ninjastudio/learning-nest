import { Injectable, NotFoundException } from '@nestjs/common';
import { Book } from './book.interface';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BookService {
  private books: Book[] = [
    {
      id: 1,
      title: '1984',
      author: 'George Orwell',
      year: 1949,
      genre: 'Dystopian',
    },
    {
      id: 2,
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      year: 1937,
      genre: 'Fantasy',
    },
  ];

  findAll(): Book[] {
    return this.books;
  }

  findOne(id: number): Book {
    const book = this.books.find((book) => book.id === id);
    if (!book) throw new NotFoundException(`Book with ID: ${id} not found`);
    return book;
  }

  create(createBookDto: CreateBookDto): Book {
    const newBook: Book = { id: Date.now(), ...createBookDto };
    this.books.push(newBook);
    return newBook;
  }

  update(
    id: number,
    updateBookDto: UpdateBookDto,
  ): { message: string; book: Book } {
    const book = this.books.find((book) => book.id === id);
    if (!book) throw new NotFoundException(`Book with ID: ${id} not found`);
    if (updateBookDto?.genre) book.genre = updateBookDto.genre;
    if (updateBookDto?.genre) book.genre = updateBookDto.genre;
    return { message: `Book with ID: ${id} updated succesfully.`, book };
  }

  delete(id: number): { message: string } {
    const index = this.books.findIndex((user) => user.id === id);
    if (index === -1) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    this.books.splice(index, 1);
    return { message: `Book with ID: ${id} deleted succesfully.` };
  }
}

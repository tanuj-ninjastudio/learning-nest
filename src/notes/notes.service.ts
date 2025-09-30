import { Injectable, NotFoundException } from '@nestjs/common';
import { Note } from './note.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { IApiResponse } from 'src/common/interfaces/api-response.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private noteRepo: Repository<Note>,
  ) {}
  private notes: Note[] = [
    {
      id: 1,
      title: 'Shopping list',
      content: 'Buy milk, eggs, bread',
      createdAt: new Date('2025-09-01T10:00:00Z'),
    },
    {
      id: 2,
      title: 'Todo',
      content: 'Finish NestJS project',
      createdAt: new Date('2025-09-02T15:30:00Z'),
    },
  ];
  static TypeOrmModule: any;

  findAll(): IApiResponse<Note[]> {
    return {
      status: 200,
      message: 'Notes fetched successfully',
      data: this.notes,
    };
  }

  findOne(id: number): IApiResponse<Note> {
    const note = this.notes.find((n) => n.id === id);
    if (!note) throw new NotFoundException(`Note with ID ${id} not found`);
    return {
      status: 200,
      message: `Note with ID ${id} fetched successfully`,
      data: note,
    };
  }

  create(createNoteDto: CreateNoteDto): IApiResponse<Note> {
    const maxId =
      this.notes.length > 0 ? Math.max(...this.notes.map((n) => n.id)) : 0;

    const newNote: Note = {
      id: maxId + 1,
      ...createNoteDto,
      createdAt: new Date(),
    };

    this.notes.push(newNote);
    return {
      status: 201,
      message: 'Note created successfully',
      data: newNote,
    };
  }

  // async create(dto: CreateNoteDto): Promise<Note> {
  //   const note = this.noteRepo.create(dto); // maps automatically
  //   return await this.noteRepo.save(note);
  // }

  patch(id: number, partialUpdateDto: Partial<UpdateNoteDto>): Note {
    const note = this.notes.find((n) => n.id === id);
    if (!note) throw new NotFoundException(`Note with ID ${id} not found`);

    Object.assign(note, partialUpdateDto);

    return note;
  }

  findNote(id: number): Note | undefined {
    const note = this.notes.find((n) => n.id === id);
    return note;
  }

  update(id: number, updateNoteDto: UpdateNoteDto): IApiResponse<Note> {
    const existing = this.findNote(id);
    if (!existing) throw new NotFoundException(`Note with ID ${id} not found`);

    Object.assign(existing, updateNoteDto);
    return {
      status: 200,
      message: `Note with ID ${id} updated successfully`,
      data: existing,
    };
  }

  delete(id: number): IApiResponse<null> {
    const index = this.notes.findIndex((n) => n.id === id);
    if (index === -1)
      throw new NotFoundException(`Note with ID ${id} not found`);

    this.notes.splice(index, 1);
    return {
      status: 200,
      message: `Note with ID ${id} deleted successfully`,
      data: null,
    };
  }
}

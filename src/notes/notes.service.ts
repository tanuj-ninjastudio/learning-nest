import { Injectable, NotFoundException } from '@nestjs/common';
import { Note } from './note.interface';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  private notes: Note[] = [
    { id: 1, title: 'Shopping list', content: 'Buy milk, eggs, bread' },
    { id: 2, title: 'Todo', content: 'Finish NestJS project' },
  ];

  findAll() {
    return {
      status: 200,
      message: 'Notes fetched successfully',
      data: this.notes,
    };
  }

  findOne(id: number) {
    const note = this.notes.find((n) => n.id === id);
    if (!note) throw new NotFoundException(`Note with ID ${id} not found`);
    return {
      status: 200,
      message: `Note with ID ${id} fetched successfully`,
      data: note,
    };
  }

  create(createNoteDto: CreateNoteDto): {
    status: number;
    message: string;
    data: Note;
  } {
    const maxId =
      this.notes.length > 0
        ? Math.max(...this.notes.map((note) => note.id))
        : 0;
    const newNote: Note = { id: maxId + 1, ...createNoteDto };
    this.notes.push(newNote);
    return {
      status: 201,
      message: 'Note created successfully',
      data: newNote,
    };
  }

  update(id: number, updateNoteDto: UpdateNoteDto) {
    const note = this.findOne(id);
    if (!note) throw new NotFoundException(`Note with ID ${id} not found`);
    Object.assign(note, updateNoteDto);
    return {
      status: 200,
      message: `Note with ID ${id} updated successfully`,
      data: note,
    };
  }

  delete(id: number) {
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

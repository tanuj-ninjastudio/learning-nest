import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse as SwaggerResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note } from './note.entity';
import type { IApiResponse } from 'src/common/interfaces/api-response.interface';

@ApiTags('Notes')
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all notes' })
  @SwaggerResponse({
    status: 200,
    description: 'Notes fetched successfully',
    // schema: {
    //   example: {
    //     status: 200,
    //     message: 'Notes fetched successfully',
    //     data: [
    //       {
    //         id: 1,
    //         title: 'Shopping list',
    //         content: 'Buy milk, eggs, bread',
    //         createdAt: '2025-09-01T10:00:00Z',
    //       },
    //       {
    //         id: 2,
    //         title: 'Todo',
    //         content: 'Finish NestJS project',
    //         createdAt: '2025-09-02T15:30:00Z',
    //       },
    //     ],
    //   },
    // },
  })
  findAllNotes(): IApiResponse<Note[]> {
    return this.notesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a note by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Note ID' })
  @SwaggerResponse({
    status: 200,
    description: 'Note fetched successfully',
    // schema: {
    //   example: {
    //     status: 200,
    //     message: 'Note with ID 1 fetched successfully',
    //     data: {
    //       id: 1,
    //       title: 'Shopping list',
    //       content: 'Buy milk, eggs, bread',
    //       createdAt: '2025-09-01T10:00:00Z',
    //     },
    //   },
    // },
  })
  findNoteById(@Param('id', ParseIntPipe) id: number): IApiResponse<Note> {
    return this.notesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new note' })
  @ApiBody({ type: CreateNoteDto })
  @SwaggerResponse({
    status: 201,
    description: 'Note created successfully',
    // schema: {
    //   example: {
    //     status: 201,
    //     message: 'Note created successfully',
    //     data: {
    //       id: 3,
    //       title: 'New Note',
    //       content: 'Some content here',
    //       createdAt: '2025-09-15T18:37:38.737Z',
    //     },
    //   },
    // },
  })
  create(@Body() createNoteDto: CreateNoteDto): IApiResponse<Note> {
    return this.notesService.create(createNoteDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a note by ID (full update)' })
  @ApiParam({ name: 'id', type: Number, description: 'Note ID' })
  @ApiBody({ type: UpdateNoteDto })
  @SwaggerResponse({
    status: 200,
    description: 'Note updated successfully',
    // schema: {
    //   example: {
    //     status: 200,
    //     message: 'Note with ID 3 updated successfully',
    //     data: {
    //       id: 3,
    //       title: 'Updated Note',
    //       content: 'Updated content',
    //       createdAt: '2025-09-15T18:37:38.737Z',
    //     },
    //   },
    // },
  })
  updateNote(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNoteDto: UpdateNoteDto,
  ): IApiResponse<Note> {
    return this.notesService.update(id, updateNoteDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Partially update a note by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Note ID' })
  @ApiBody({ type: UpdateNoteDto })
  @SwaggerResponse({
    status: 200,
    description: 'Note patched successfully',
    // schema: {
    //   example: {
    //     status: 200,
    //     message: 'Note with ID 3 patched successfully',
    //     data: {
    //       id: 3,
    //       title: 'Updated title only',
    //       content: 'Buy milk, eggs, bread',
    //       createdAt: '2025-09-15T18:37:38.737Z',
    //     },
    //   },
    // },
  })
  patchNote(
    @Param('id', ParseIntPipe) id: number,
    @Body() partialUpdateDto: Partial<UpdateNoteDto>,
  ): IApiResponse<Note> {
    const patchedNote = this.notesService.patch(id, partialUpdateDto);
    return {
      status: 200,
      message: `Note with ID ${id} patched successfully`,
      data: patchedNote,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a note by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Note ID' })
  @SwaggerResponse({
    status: 200,
    description: 'Note deleted successfully',
    // schema: {
    //   example: {
    //     status: 200,
    //     message: 'Note with ID 3 deleted successfully',
    //     data: null,
    //   },
    // },
  })
  deleteNote(@Param('id', ParseIntPipe) id: number): IApiResponse<null> {
    return this.notesService.delete(id);
  }
}

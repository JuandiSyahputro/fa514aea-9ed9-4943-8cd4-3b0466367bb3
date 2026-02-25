import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { PaginatedUserResponse } from './create.pagination.response.dto';
import { CreateUserDto } from './create.user.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('api/users')
export class UserController {
  constructor(private readonly user: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiQuery({
    name: 'first_name',
    type: String,
    required: false,
    description: 'Filter by first name (asc or desc)',
  })
  @ApiQuery({
    name: 'last_name',
    type: String,
    required: false,
    description: 'Filter by last name (asc or desc)',
  })
  @ApiQuery({
    name: 'position',
    type: String,
    required: false,
    description: 'Filter by position (asc or desc)',
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'size',
    type: Number,
    required: false,
    description: 'Number of results per page',
  })
  @ApiOkResponse({
    description: 'Get all users',
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  async findAll(
    @Query('first_name') firstNameOrder: 'asc' | 'desc',
    @Query('last_name') lastNameOrder: 'asc' | 'desc',
    @Query('position') positionOrder: 'asc' | 'desc',
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
  ): Promise<PaginatedUserResponse> {
    return this.user.findAll(
      firstNameOrder,
      lastNameOrder,
      positionOrder,
      page,
      size,
    );
  }

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiConsumes('application/json')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(NoFilesInterceptor())
  @ApiBody({ type: CreateUserDto, description: 'Create user' })
  @ApiCreatedResponse({ description: 'User created' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async create(@Body() user: CreateUserDto): Promise<User> {
    return await this.user.create(user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiParam({ name: 'id', type: 'integer' })
  @ApiConsumes('application/json')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(NoFilesInterceptor())
  @ApiBody({ type: CreateUserDto, description: 'Update user' })
  @ApiOkResponse({ description: 'User updated' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async update(@Body() user: User, @Param('id') id: number): Promise<User> {
    return await this.user.update(user, id);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: 'integer',
  })
  @ApiOkResponse({
    description: 'User deleted',
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  async delete(@Param('id') id: number): Promise<User> {
    return await this.user.delete(id);
  }
}

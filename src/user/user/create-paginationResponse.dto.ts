import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { CreateUserDto } from './create-user.dto';

export class PaginatedUserResponse {
  @ApiProperty()
  current_page: number;

  @ApiProperty({ type: CreateUserDto, isArray: true })
  data: User[];

  @ApiProperty()
  total_items: number;

  @ApiProperty()
  total_pages: number;
}

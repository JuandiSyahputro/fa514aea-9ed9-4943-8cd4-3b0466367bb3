import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma/prisma.service';
import { CreateUserDto } from './create-user.dto';
import { UserController } from './user.controller';
import { PaginatedUserResponse } from './create-paginationResponse.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserController.name);
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    firstNameOrder: 'asc' | 'desc',
    lastNameOrder: 'asc' | 'desc',
    positionOrder: 'asc' | 'desc',
    page: number,
    size: number,
  ): Promise<PaginatedUserResponse> {
    const skip = (Number(page) - 1) * Number(size);

    const orderBy: Prisma.UserOrderByWithRelationInput[] = [];
    if (firstNameOrder) orderBy.push({ first_name: firstNameOrder });
    if (lastNameOrder) orderBy.push({ last_name: lastNameOrder });
    if (positionOrder) orderBy.push({ position: positionOrder });

    const [users, totalItems] = await Promise.all([
      this.prisma.user.findMany({
        orderBy,
        skip,
        take: Number(size),
      }),
      this.prisma.user.count(),
    ]);

    const totalPages = Math.ceil(totalItems / Number(size));

    return {
      current_page: Number(page),
      data: users,
      total_items: totalItems,
      total_pages: totalPages,
    };
  }

  async create(user: CreateUserDto): Promise<User> {
    try {
      const existingEmailUser = await this.prisma.user.findUnique({
        where: { email: user.email },
      });

      if (existingEmailUser) {
        throw new BadRequestException('Email already exists');
      }

      const existingPhoneNumberUser = await this.prisma.user.findUnique({
        where: { phone_number: user.phone_number },
      });

      if (existingPhoneNumberUser) {
        throw new BadRequestException('Phone number already exists');
      }

      return this.prisma.user.create({
        data: user,
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async update(user: User, id: number): Promise<User> {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { id: Number(id) },
      });

      if (!existingUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      if (user.email && user.email !== existingUser.email) {
        const existingEmailUser = await this.prisma.user.findUnique({
          where: { email: user.email },
        });

        if (existingEmailUser) {
          throw new BadRequestException('Email already exists');
        }
      }

      if (
        user.phone_number &&
        user.phone_number !== existingUser.phone_number
      ) {
        const existingPhoneNumberUser = await this.prisma.user.findUnique({
          where: { phone_number: user.phone_number },
        });

        if (existingPhoneNumberUser) {
          throw new BadRequestException('Phone number already exists');
        }
      }

      const dataToUpdate = {
        first_name: user.first_name || existingUser.first_name,
        last_name: user.last_name || existingUser.last_name,
        position: user.position || existingUser.position,
        phone_number: user.phone_number || existingUser.phone_number,
        email: user.email || existingUser.email,
      };

      return this.prisma.user.update({
        where: { id: Number(id) },
        data: dataToUpdate,
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async delete(id: number): Promise<User> {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { id: Number(id) },
      });

      if (!existingUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return this.prisma.user.delete({
        where: {
          id: Number(id),
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}

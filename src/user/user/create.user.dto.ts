import { IsString, IsNotEmpty, Length, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'First name of the user', maxLength: 15 })
  @IsString()
  @IsNotEmpty()
  @Length(1, 15)
  first_name: string;

  @ApiProperty({ description: 'Last name of the user', maxLength: 15 })
  @IsString()
  @IsNotEmpty()
  @Length(1, 15)
  last_name: string;

  @ApiProperty({ description: 'User position', maxLength: 15 })
  @IsString()
  @IsNotEmpty()
  @Length(1, 15)
  position: string;

  @ApiProperty({
    description: 'Phone number of the user',
    minLength: 10,
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @Length(10, 20)
  phone_number: string;

  @ApiProperty({ description: 'Email address of the user' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

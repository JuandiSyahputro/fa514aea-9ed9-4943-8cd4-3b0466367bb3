import { IsString, IsNotEmpty, Length, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 15)
  first_name: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 15)
  last_name: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 15)
  position: string;

  @IsString()
  @IsNotEmpty()
  @Length(10, 20)
  phone_number: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}

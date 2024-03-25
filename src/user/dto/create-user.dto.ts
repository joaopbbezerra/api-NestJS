import {
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  //If we do not specify the other properties, it will be one
  //So we would need a lowercase, a uppercase and symbol.
  @IsStrongPassword({
    minLength: 6,
  })
  password: string;

  @IsOptional()
  @IsDateString()
  birthAt: string;
}

import { IsEmail, IsString, MinLength } from '@nestjs/class-validator';

export class LogInUserDto {
  @IsEmail({}, { message: '아이디는 이메일 형식이어야 합니다.' })
  email: string;

  @IsString()
  @MinLength(5, { message: '비밀번호는 5자 이상이어야 합니다.' })
  password: string;
}

export class SignUpUserDto extends LogInUserDto {
  @IsString()
  @MinLength(2, { message: '닉네임은 2자 이상이어야 합니다.' })
  nickname: string;

  @IsString()
  location: string;
}

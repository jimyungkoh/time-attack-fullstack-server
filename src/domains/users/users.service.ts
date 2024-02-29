import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import { nanoid } from 'nanoid';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { LogInUserDto, SignUpUserDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}

  async createUser(signUpUserDto: SignUpUserDto) {
    const id = nanoid(this.configService.get('NANOID_SIZE'));

    const encryptedPassword = await hash(
      signUpUserDto.password,
      parseInt(this.configService.get('HASH_SALT')),
    );

    return await this.prismaService.user.create({
      data: {
        id,
        email: signUpUserDto.email,
        nickname: signUpUserDto.nickname,
        location: signUpUserDto.location,
        encryptedPassword,
      },
    });
  }

  async findUserByEmail(userEmail: string) {
    return await this.prismaService.user.findUnique({
      where: { email: userEmail },
    });
  }

  async validateUsersCredential(user: User, logInUserDto: LogInUserDto) {
    if (!user) return false;

    const passwordMatch = await compare(
      logInUserDto.password,
      user.encryptedPassword,
    );

    return passwordMatch;
  }
}

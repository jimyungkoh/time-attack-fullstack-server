import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { JwtManagerService } from 'src/common/jwt-manager/jwt-manager.service';
import { DAccount } from 'src/dacorators/account.decorator';
import { Private } from 'src/dacorators/private.decorator';
import {
  DUPLICATE_USER,
  INVALID_USER_CREDENTIAL,
} from './users-error.messages';
import { LogInUserDto, SignUpUserDto } from './users.dto';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtManagerService: JwtManagerService,
  ) {}

  maxAge = parseInt(this.configService.get('COOKIE_MAX_AGE'));

  @Post('auth/sign-up')
  async signUp(
    @Body() signUpUserDto: SignUpUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const duplicateUser = await this.usersService.findUserByEmail(
      signUpUserDto.email,
    );

    if (duplicateUser) throw new ConflictException(DUPLICATE_USER);

    const user = await this.usersService.createUser(signUpUserDto);

    const accessToken = this.jwtManagerService.sign('user', {
      id: user.id,
      email: user.email,
    });

    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      domain:
        'https://port-0-time-attack-fullstack-server-dc9c2nltdolabq.sel5.cloudtype.app/',
      maxAge: this.maxAge,
    });

    return { accessToken };
  }

  @Post('auth/log-in')
  async logIn(
    @Res({ passthrough: true }) response: Response,
    @Body() logInUserDto: LogInUserDto,
  ) {
    const foundUser = await this.usersService.findUserByEmail(
      logInUserDto.email,
    );

    const validate = await this.usersService.validateUsersCredential(
      foundUser,
      logInUserDto,
    );

    if (!validate) throw new UnauthorizedException(INVALID_USER_CREDENTIAL);

    const accessToken = this.jwtManagerService.sign('user', {
      id: foundUser.id,
      email: foundUser.email,
    });

    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      domain:
        'https://port-0-time-attack-fullstack-server-dc9c2nltdolabq.sel5.cloudtype.app/',
      maxAge: this.maxAge,
    });

    return { accessToken };
  }

  @Private('user')
  @Delete('/auth/log-out')
  async logOut(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('accessToken');
    return;
  }

  @Private('user')
  @Get('/auth/refresh')
  async refreshToken(
    @DAccount('user') user,
    @Res({ passthrough: true })
    response: Response,
  ) {
    const accessToken = this.jwtManagerService.sign('user', {
      id: user.id,
      email: user.email,
    });

    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      domain:
        'https://port-0-time-attack-fullstack-server-dc9c2nltdolabq.sel5.cloudtype.app/',
      maxAge: this.maxAge,
    });

    return accessToken;
  }
}

import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { AccountType } from 'src/domains/users/user.type';

@Injectable()
export class JwtManagerService implements OnModuleInit {
  secretKey: string | undefined;

  constructor(private readonly configService: ConfigService) {}
  onModuleInit() {
    this.secretKey = this.configService.get('JWT_SECRET');
  }

  sign(accountType: AccountType, { id, email }: Pick<User, 'id' | 'email'>) {
    return sign({ accountType, email }, this.secretKey, {
      subject: id,
      expiresIn: '2h',
    });
  }

  async verifyAccessToken(accessToken: string) {
    const secretKey = this.configService.getOrThrow<string>('JWT_SECRET');

    const { sub: id, accountType } = verify(
      accessToken,
      secretKey,
    ) as JwtPayload & { accountType: AccountType };

    return { id, accountTypeOfToken: accountType };
  }
}

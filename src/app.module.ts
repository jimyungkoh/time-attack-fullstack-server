import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { JwtManagerModule } from './common/jwt-manager/jwt-manager.module';
import { AmazonS3Module } from './database/amazon-s3/amazon-s3.module';
import { PrismaModule } from './database/prisma/prisma.module';
import { DealsModule } from './domains/deals/deals.module';
import { UsersModule } from './domains/users/users.module';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    JwtManagerModule,
    UsersModule,
    DealsModule,
    AmazonS3Module,
  ],
  controllers: [AppController],
  providers: [{ provide: APP_GUARD, useClass: AuthGuard }],
})
export class AppModule {}

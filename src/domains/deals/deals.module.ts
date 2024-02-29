import { Module } from '@nestjs/common';
import { AmazonS3Module } from 'src/database/amazon-s3/amazon-s3.module';
import { DealsController } from './deals.controller';
import { DealsService } from './deals.service';

@Module({
  imports: [AmazonS3Module],
  controllers: [DealsController],
  providers: [DealsService],
})
export class DealsModule {}

import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '@prisma/client';
import { DAccount } from 'src/dacorators/account.decorator';
import { Private } from 'src/dacorators/private.decorator';
import { NOT_ALLOWED_USER } from '../users/users-error.messages';
import { NOT_FOUND_DEAL } from './deals-error.messages';
import { CreateDealsDto, EditDealsDto } from './deals.dto';
import { DealsService } from './deals.service';

@Controller('deals')
export class DealsController {
  constructor(private readonly dealsService: DealsService) {}

  @Get()
  async findDeals() {
    return await this.dealsService.findDeals();
  }

  @Get(':dealId')
  async findDealById(@Param('dealId') dealId: string) {
    console.log(dealId);
    const result =
      await this.dealsService.findDealByIdWithViewCountFetch(dealId);
    console.log(result);
    return result;
  }

  @Delete(':dealId')
  @Private('user')
  async deleteDealById(@Param('dealId') dealId: string) {
    return await this.dealsService.deleteDealById(dealId);
  }

  @Post()
  @Private('user')
  @UseInterceptors(FileInterceptor('file'))
  async createDeal(
    @DAccount('user') user: User,
    @UploadedFile() file: Express.Multer.File,
    @Body() dealsDto: CreateDealsDto,
  ) {
    const { title, price, description, location } = dealsDto;

    if (isNaN(parseInt(price)))
      throw new BadRequestException('가격은 숫자로 입력해주세요.');

    return await this.dealsService.createDeal(
      user,
      { title, price: parseInt(price), description, location },
      file,
    );
  }

  @Put(':dealId')
  @Private('user')
  async editDeal(
    @DAccount('user') user: User,
    @Param() dealId: string,
    @Body() dealsDto: EditDealsDto,
  ) {
    const foundDeal = await this.dealsService.findDealById(dealId);

    if (!foundDeal) throw new NotFoundException(NOT_FOUND_DEAL);
    else if (foundDeal.sellerId !== user.id)
      throw new ForbiddenException(NOT_ALLOWED_USER);

    return await this.dealsService.editDeal(dealId, dealsDto);
  }

  @Put(':dealId/like')
  @Private('user')
  async toggleDealLike(
    @DAccount('user') user: User,
    @Param('dealId') dealId: string,
  ) {
    return await this.dealsService.toggleDealLike({
      likerId: user.id,
      dealsId: dealId,
    });
  }
}

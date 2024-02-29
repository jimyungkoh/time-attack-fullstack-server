import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, User } from '@prisma/client';
import { nanoid } from 'nanoid';
import { AmazonS3Service } from 'src/database/amazon-s3/amazon-s3.service';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Injectable()
export class DealsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly amazonS3Service: AmazonS3Service,
  ) {}

  async findDeals() {
    return await this.prismaService.deals.findMany({
      include: {
        seller: {
          select: { id: true },
        },
      },
    });
  }

  async findDealById(dealId: string) {
    return await this.prismaService.deals.findUnique({
      where: { id: dealId },
      include: {
        seller: {
          select: { id: true },
        },
      },
    });
  }

  async findDealByIdWithViewCountFetch(dealId: string) {
    const deal = await this.prismaService.deals.update({
      where: { id: dealId },
      data: { viewCnt: { increment: 1 } },
      include: {
        likedDeals: {
          select: { liker: true },
        },
        seller: {
          select: { id: true },
        },
      },
    });

    if (!deal) return null;

    return deal;
  }

  async createDeal(
    user: User,
    data: Omit<Prisma.DealsUncheckedCreateInput, 'id' | 'sellerId'>,
    file?: Express.Multer.File,
  ) {
    const id = nanoid(this.configService.get('NANOID_SIZE'));

    let imageUrl: string | undefined;

    if (file) {
      const ext = file.originalname.split('.').pop();
      imageUrl = await this.amazonS3Service.imageUploadToS3(
        `${id}.${ext}`,
        file,
        ext,
      );
    }

    const deal = await this.prismaService.deals.create({
      data: {
        ...data,
        sellerId: user.id,
        id,
        imgUrl: imageUrl.split('/').pop(),
      },
    });

    return { ...deal, imageUrl };
  }

  async editDeal(dealId: string, dealsDto: any) {
    const data: Prisma.DealsUpdateInput = {
      ...dealsDto,
    };

    const deal = await this.prismaService.deals.update({
      where: { id: dealId },
      data,
    });

    return deal;
  }

  async deleteDealById(dealId: string) {
    return await this.prismaService.deals.delete({
      where: {
        id: dealId,
      },
    });
  }

  async toggleDealLike({
    likerId,
    dealsId,
  }: Prisma.LikedDealsLikerIdDealsIdCompoundUniqueInput) {
    const foundLike = await this.prismaService.likedDeals.findUnique({
      where: { likerId_dealsId: { likerId, dealsId } },
    });

    if (foundLike) {
      await this.prismaService.likedDeals.delete({
        where: { likerId_dealsId: { likerId, dealsId } },
      });
      return false;
    }

    await this.prismaService.likedDeals.create({
      data: { likerId, dealsId },
    });

    return true;
  }
}

import { IsString, MinLength } from 'class-validator';

export class CreateDealsDto {
  @IsString()
  @MinLength(1, { message: '제목을 1자 이상 입력해주세요.' })
  title: string;

  @IsString()
  @MinLength(1, { message: '설명을 입력해주세요.' })
  description: string;

  @IsString()
  price: string;

  @IsString()
  @MinLength(1, { message: '거래 지역을 입력해주세요.' })
  location: string;
}

export class EditDealsDto extends CreateDealsDto {}

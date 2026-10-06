import { IsBoolean, IsOptional, IsString, Matches } from 'class-validator';

class BookFieldsDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  authors?: string;

  @IsOptional()
  @IsBoolean()
  favorite?: boolean;

  @IsOptional()
  @IsString()
  fileCover?: string;

  @IsOptional()
  @IsString()
  fileName?: string;

  @IsOptional()
  @IsString()
  fileBook?: string;
}

export class CreateBookDto extends BookFieldsDto {
  @IsString()
  @Matches(/\S/, { message: 'title must not be empty' })
  title: string;
}

export class UpdateBookDto extends BookFieldsDto {
  @IsOptional()
  @IsString()
  @Matches(/\S/, { message: 'title must not be empty' })
  title?: string;
}

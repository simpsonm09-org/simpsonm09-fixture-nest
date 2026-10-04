import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator';

/** Payload used to create or replace an item. `id` is assigned by the store. */
export class ItemRequestDto {
  @ApiProperty({ description: 'Item name', example: 'Widget', maxLength: 200 })
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, { message: 'name must not be blank' })
  @MaxLength(200)
  name!: string;

  @ApiPropertyOptional({
    description: 'Item description',
    example: 'A small widget',
    maxLength: 2000,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string | null;
}

/** An item returned by the API. */
export class ItemResponseDto {
  @ApiProperty({ description: 'Server-assigned identifier', example: 1, type: 'integer', format: 'int64' })
  id!: number;

  @ApiProperty({ description: 'Item name', example: 'Widget' })
  name!: string;

  @ApiProperty({ description: 'Item description', example: 'A small widget', nullable: true })
  description!: string | null;
}

import { Type } from "class-transformer";
import {
  ArrayMaxSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  Validate,
  ValidateNested,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  FarmAreaConsistencyConstraint,
  IsValidCropNameConstraint,
  IsValidHarvestYearConstraint,
  IsValidStateCodeConstraint,
} from "./domain-value.validators";

export class CropRequestDto {
  @ApiPropertyOptional({
    example: "00000000-0000-4000-8000-000000000001",
    format: "uuid",
  })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiProperty({ example: "Soja", maxLength: 120 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  @Validate(IsValidCropNameConstraint)
  name: string;
}

export class HarvestRequestDto {
  @ApiPropertyOptional({
    example: "00000000-0000-4000-8000-000000000002",
    format: "uuid",
  })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiProperty({ example: "2024/2025", maxLength: 9 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(9)
  @Validate(IsValidHarvestYearConstraint)
  year: string;

  @ApiProperty({ type: () => [CropRequestDto], required: false, default: [] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(100)
  @ValidateNested({ each: true })
  @Type(() => CropRequestDto)
  crops?: CropRequestDto[];
}

export class FarmRequestDto {
  @ApiPropertyOptional({
    example: "00000000-0000-4000-8000-000000000003",
    format: "uuid",
  })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiProperty({ example: "Fazenda Boa Vista", maxLength: 120 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;

  @ApiProperty({ example: "Ribeirão Preto", maxLength: 120 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  city: string;

  @ApiProperty({ example: "SP", maxLength: 2 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2)
  @Validate(IsValidStateCodeConstraint)
  state: string;

  @ApiProperty({ example: 100, minimum: 0 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Validate(FarmAreaConsistencyConstraint)
  totalArea: number;

  @ApiProperty({ example: 60, minimum: 0 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  agriculturalArea: number;

  @ApiProperty({ example: 30, minimum: 0 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  vegetationArea: number;

  @ApiProperty({
    type: () => [HarvestRequestDto],
    required: false,
    default: [],
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(100)
  @ValidateNested({ each: true })
  @Type(() => HarvestRequestDto)
  harvests?: HarvestRequestDto[];
}

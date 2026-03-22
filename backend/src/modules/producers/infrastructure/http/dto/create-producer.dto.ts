import { Type } from "class-transformer";
import {
  ArrayMaxSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Validate,
  ValidateNested,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsValidDocumentConstraint } from "./domain-value.validators";
import { FarmRequestDto } from "./producer-nested.request.dto";

export class CreateProducerDto {
  @ApiProperty({ example: "529.982.247-25", maxLength: 18 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(18)
  @Validate(IsValidDocumentConstraint)
  document: string;

  @ApiProperty({ example: "João da Silva", maxLength: 120 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;

  @ApiPropertyOptional({ type: () => [FarmRequestDto], default: [] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(100)
  @ValidateNested({ each: true })
  @Type(() => FarmRequestDto)
  farms?: FarmRequestDto[];
}

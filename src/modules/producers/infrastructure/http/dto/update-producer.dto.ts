import { Type } from "class-transformer";
import {
  ArrayMaxSize,
  IsArray,
  IsOptional,
  IsString,
  MaxLength,
  Validate,
  ValidateNested,
} from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsValidDocumentConstraint } from "./domain-value.validators";
import { FarmRequestDto } from "./producer-nested.request.dto";

export class UpdateProducerDto {
  @ApiPropertyOptional({ example: "529.982.247-25", maxLength: 18 })
  @IsOptional()
  @IsString()
  @MaxLength(18)
  @Validate(IsValidDocumentConstraint)
  document?: string;

  @ApiPropertyOptional({ example: "Maria da Silva", maxLength: 120 })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;

  @ApiPropertyOptional({ type: () => [FarmRequestDto], default: [] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(100)
  @ValidateNested({ each: true })
  @Type(() => FarmRequestDto)
  farms?: FarmRequestDto[];
}

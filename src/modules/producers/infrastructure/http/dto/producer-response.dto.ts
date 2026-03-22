import { ApiProperty } from "@nestjs/swagger";

export class CropResponseDto {
  @ApiProperty({
    format: "uuid",
    example: "00000000-0000-4000-8000-000000000001",
  })
  id: string;

  @ApiProperty({ example: "Soja" })
  name: string;
}

export class HarvestResponseDto {
  @ApiProperty({
    format: "uuid",
    example: "00000000-0000-4000-8000-000000000002",
  })
  id: string;

  @ApiProperty({ example: "2024/2025" })
  year: string;

  @ApiProperty({ type: () => [CropResponseDto] })
  crops: CropResponseDto[];
}

export class FarmResponseDto {
  @ApiProperty({
    format: "uuid",
    example: "00000000-0000-4000-8000-000000000003",
  })
  id: string;

  @ApiProperty({ example: "Fazenda Boa Vista" })
  name: string;

  @ApiProperty({ example: "Ribeirão Preto" })
  city: string;

  @ApiProperty({ example: "SP" })
  state: string;

  @ApiProperty({ example: 100 })
  totalArea: number;

  @ApiProperty({ example: 60 })
  agriculturalArea: number;

  @ApiProperty({ example: 30 })
  vegetationArea: number;

  @ApiProperty({ type: () => [HarvestResponseDto] })
  harvests: HarvestResponseDto[];
}

export class ProducerResponseDto {
  @ApiProperty({
    format: "uuid",
    example: "00000000-0000-4000-8000-000000000004",
  })
  id: string;

  @ApiProperty({ example: "529.982.247-25" })
  document: string;

  @ApiProperty({ example: "João da Silva" })
  name: string;

  @ApiProperty({ type: () => [FarmResponseDto] })
  farms: FarmResponseDto[];
}

export class ListProducersResponseDto {
  @ApiProperty({ type: () => [ProducerResponseDto] })
  data: ProducerResponseDto[];

  @ApiProperty({ example: 1 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;
}

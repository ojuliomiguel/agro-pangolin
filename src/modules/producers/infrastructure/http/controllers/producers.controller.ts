import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  ParseUUIDPipe,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiBody,
  ApiQuery,
} from "@nestjs/swagger";
import { CreateProducerUseCase } from "../../../application/use-cases/create-producer/create-producer.use-case";
import { DeleteProducerUseCase } from "../../../application/use-cases/delete-producer/delete-producer.use-case";
import { GetProducerUseCase } from "../../../application/use-cases/get-producer/get-producer.use-case";
import { ListProducersUseCase } from "../../../application/use-cases/list-producers/list-producers.use-case";
import { UpdateProducerUseCase } from "../../../application/use-cases/update-producer/update-producer.use-case";
import { CreateProducerDto } from "../dto/create-producer.dto";
import { ListProducersQueryDto } from "../dto/list-producers.query";
import {
  ListProducersResponseDto,
  ProducerResponseDto,
} from "../dto/producer-response.dto";
import { UpdateProducerDto } from "../dto/update-producer.dto";

@ApiTags("producers")
@Controller("producers")
export class ProducersController {
  constructor(
    private readonly createProducerUseCase: CreateProducerUseCase,
    private readonly updateProducerUseCase: UpdateProducerUseCase,
    private readonly deleteProducerUseCase: DeleteProducerUseCase,
    private readonly getProducerUseCase: GetProducerUseCase,
    private readonly listProducersUseCase: ListProducersUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: "Cria um produtor rural" })
  @ApiBody({ type: CreateProducerDto })
  @ApiCreatedResponse({ type: ProducerResponseDto })
  @ApiBadRequestResponse({ description: "Payload inválido." })
  @ApiConflictResponse({ description: "Documento já cadastrado." })
  async create(@Body() body: CreateProducerDto): Promise<ProducerResponseDto> {
    return this.createProducerUseCase.execute(body);
  }

  @Get()
  @ApiOperation({ summary: "Lista produtores com paginação" })
  @ApiQuery({ name: "page", required: false, type: Number, example: 1 })
  @ApiQuery({ name: "limit", required: false, type: Number, example: 10 })
  @ApiOkResponse({ type: ListProducersResponseDto })
  @ApiBadRequestResponse({ description: "Query inválida." })
  async list(
    @Query() query: ListProducersQueryDto,
  ): Promise<ListProducersResponseDto> {
    return this.listProducersUseCase.execute(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Busca um produtor pelo id" })
  @ApiParam({ name: "id", format: "uuid" })
  @ApiOkResponse({ type: ProducerResponseDto })
  @ApiBadRequestResponse({ description: "Id inválido." })
  @ApiNotFoundResponse({ description: "Produtor não encontrado." })
  async get(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<ProducerResponseDto> {
    return this.getProducerUseCase.execute({ id });
  }

  @Patch(":id")
  @ApiOperation({ summary: "Atualiza um produtor rural" })
  @ApiParam({ name: "id", format: "uuid" })
  @ApiBody({ type: UpdateProducerDto })
  @ApiOkResponse({ type: ProducerResponseDto })
  @ApiBadRequestResponse({ description: "Payload ou id inválido." })
  @ApiNotFoundResponse({ description: "Produtor não encontrado." })
  @ApiConflictResponse({ description: "Documento já cadastrado." })
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() body: UpdateProducerDto,
  ): Promise<ProducerResponseDto> {
    return this.updateProducerUseCase.execute({ id, ...body });
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Remove um produtor rural" })
  @ApiParam({ name: "id", format: "uuid" })
  @ApiNoContentResponse({ description: "Produtor removido com sucesso." })
  @ApiBadRequestResponse({ description: "Id inválido." })
  @ApiNotFoundResponse({ description: "Produtor não encontrado." })
  async remove(@Param("id", ParseUUIDPipe) id: string): Promise<void> {
    await this.deleteProducerUseCase.execute({ id });
  }
}

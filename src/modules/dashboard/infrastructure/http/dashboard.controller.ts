import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { GetDashboardUseCase } from "../../application/use-cases/get-dashboard.use-case";
import { DashboardSummary } from "../../domain/view-models/dashboard-summary";

@ApiTags("Dashboard")
@Controller("dashboard")
export class DashboardController {
  constructor(private readonly getDashboardUseCase: GetDashboardUseCase) {}

  @Get()
  @ApiOperation({
    summary: "Obter visão gerencial analítica (Dashboard)",
    description:
      "Retorna totais de fazendas, hectares, uso do solo e distribuição por estado e cultura.",
  })
  @ApiResponse({
    status: 200,
    description: "Resumo do dashboard retornado com sucesso.",
    schema: {
      example: {
        totalFarms: 10,
        totalHectares: 1000,
        byState: [{ state: "SP", count: 10 }],
        byCrop: [{ crop: "Soja", count: 10 }],
        bySoilUse: {
          agricultural: 800,
          vegetation: 200,
        },
      },
    },
  })
  async getDashboard(): Promise<DashboardSummary> {
    return this.getDashboardUseCase.execute();
  }
}

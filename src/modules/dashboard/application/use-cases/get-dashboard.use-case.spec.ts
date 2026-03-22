import { Test, TestingModule } from "@nestjs/testing";
import { GetDashboardUseCase } from "./get-dashboard.use-case";
import { DashboardQuery } from "../../domain/ports/dashboard-query";
import { DASHBOARD_QUERY } from "../../infrastructure/providers/tokens";
import { DashboardSummary } from "../../domain/view-models/dashboard-summary";

describe("GetDashboardUseCase", () => {
  let useCase: GetDashboardUseCase;
  let dashboardQueryMock: jest.Mocked<DashboardQuery>;

  beforeEach(async () => {
    dashboardQueryMock = {
      getSummary: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetDashboardUseCase,
        {
          provide: DASHBOARD_QUERY,
          useValue: dashboardQueryMock,
        },
      ],
    }).compile();

    useCase = module.get<GetDashboardUseCase>(GetDashboardUseCase);
  });

  it("deve retornar o resumo do dashboard delegado pela porta de leitura (query port)", async () => {
    const expectedSummary: DashboardSummary = {
      totalFarms: 10,
      totalHectares: 1000,
      byState: [{ state: "SP", count: 10 }],
      byCrop: [{ crop: "Soja", count: 10 }],
      bySoilUse: {
        agricultural: 800,
        vegetation: 200,
      },
    };
    dashboardQueryMock.getSummary.mockResolvedValueOnce(expectedSummary);

    const result = await useCase.execute();

    expect(dashboardQueryMock.getSummary.mock.calls.length).toBe(1);
    expect(result).toEqual(expectedSummary);
  });
});

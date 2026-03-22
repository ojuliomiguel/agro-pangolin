import { Inject, Injectable } from "@nestjs/common";
import { DashboardSummary } from "../../domain/view-models/dashboard-summary";
import type { DashboardQuery } from "../../domain/ports/dashboard-query";
import { DASHBOARD_QUERY } from "../../infrastructure/providers/tokens";

@Injectable()
export class GetDashboardUseCase {
  constructor(
    @Inject(DASHBOARD_QUERY)
    private readonly dashboardQuery: DashboardQuery,
  ) {}

  async execute(): Promise<DashboardSummary> {
    return this.dashboardQuery.getSummary();
  }
}

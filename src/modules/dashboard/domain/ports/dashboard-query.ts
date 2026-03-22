import { DashboardSummary } from "../view-models/dashboard-summary";

export interface DashboardQuery {
  getSummary(): Promise<DashboardSummary>;
}

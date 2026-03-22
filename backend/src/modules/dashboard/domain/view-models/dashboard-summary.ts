export interface DashboardSummary {
  totalFarms: number;
  totalHectares: number;
  byState: { state: string; count: number }[];
  byCrop: { crop: string; count: number }[];
  bySoilUse: { agricultural: number; vegetation: number };
}

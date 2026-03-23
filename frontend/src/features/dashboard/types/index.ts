export interface DashboardSummary {
  totalFarms: number;
  totalHectares: number;
  byState: DashboardByState[];
  byCrop: DashboardByCrop[];
  bySoilUse: DashboardBySoilUse;
}

export interface DashboardByState {
  state: string;
  count: number;
}

export interface DashboardByCrop {
  crop: string;
  count: number;
}

export interface DashboardBySoilUse {
  agricultural: number;
  vegetation: number;
}

export const DASHBOARD_ENDPOINT = '/dashboard';
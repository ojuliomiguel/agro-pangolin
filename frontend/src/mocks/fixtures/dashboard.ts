import type { DashboardSummary } from '../../features/dashboard/types'

export const dashboardFixture: DashboardSummary = {
  totalFarms: 150,
  totalHectares: 25000,
  byState: [
    { state: 'SP', count: 45 },
    { state: 'MG', count: 35 },
    { state: 'PR', count: 30 },
    { state: 'GO', count: 25 },
    { state: 'MT', count: 15 },
  ],
  byCrop: [
    { crop: 'Soja', count: 80 },
    { crop: 'Milho', count: 50 },
    { crop: 'Café', count: 20 },
    { crop: 'Cana', count: 15 },
    { crop: 'Algodão', count: 10 },
  ],
  bySoilUse: {
    agricultural: 18000,
    vegetation: 7000,
  },
}

export const dashboardEmptyFixture: DashboardSummary = {
  totalFarms: 0,
  totalHectares: 0,
  byState: [],
  byCrop: [],
  bySoilUse: {
    agricultural: 0,
    vegetation: 0,
  },
}

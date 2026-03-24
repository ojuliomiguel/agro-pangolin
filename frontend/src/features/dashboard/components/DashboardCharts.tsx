import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import type { DashboardByState, DashboardByCrop, DashboardBySoilUse } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/Card/Card'

const COLORS = ['#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

interface DashboardChartsProps {
  byState: DashboardByState[]
  byCrop: DashboardByCrop[]
  bySoilUse: DashboardBySoilUse
}

export function DashboardCharts({ byState, byCrop, bySoilUse }: DashboardChartsProps) {
  const soilUseData = [
    { name: 'Agrícola', value: bySoilUse.agricultural },
    { name: 'Vegetação', value: bySoilUse.vegetation },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Distribuição por Estado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={byState}
                  dataKey="count"
                  nameKey="state"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {byState.map((_, index) => (
                    <Cell key={`state-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Distribuição por Cultura</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            {byCrop.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 opacity-30"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 10.5a8.25 8.25 0 1116.5 0M12 3v1.5M12 19.5V21M4.22 4.22l1.06 1.06M18.72 5.28l-1.06 1.06M3 10.5H1.5M22.5 10.5H21"
                  />
                </svg>
                <p className="text-sm font-medium">Nenhuma cultura cadastrada</p>
                <p className="text-xs">Adicione culturas às safras para visualizar a distribuição.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={byCrop}
                    dataKey="count"
                    nameKey="crop"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {byCrop.map((_, index) => (
                      <Cell key={`crop-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Uso do Solo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={soilUseData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, value }) => `${name}: ${value.toLocaleString()} ha`}
                >
                  <Cell fill="#22c55e" />
                  <Cell fill="#0ea5e9" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
'use client'

import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

interface FinancialChartProps {
  data: Record<string, unknown>[]
  type?: 'line' | 'area' | 'bar' | 'pie'
  xKey: string
  yKeys: string[]
  height?: number
  title?: string
}

const COLORS = [
  'hsl(210, 90%, 45%)',   // primary blue
  'hsl(178, 65%, 50%)',   // accent teal
  'hsl(39, 90%, 50%)',    // orange
  'hsl(0, 84%, 50%)',     // red
  'hsl(280, 85%, 50%)',   // purple
]

export function FinancialChart({
  data,
  type = 'line',
  xKey,
  yKeys,
  height = 300,
  title,
}: FinancialChartProps) {
  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-lg border border-dashed border-muted bg-secondary/20"
        style={{ height }}
      >
        <p className="text-muted-foreground">No data available for chart</p>
      </div>
    )
  }

  // Prepare data for charts
  const chartData = data.map(row => {
    const obj: Record<string, unknown> = {
      [xKey]: (row as Record<string, unknown>)[xKey],
    }
    yKeys.forEach(key => {
      const value = (row as Record<string, unknown>)[key]
      obj[key] = typeof value === 'number' ? value : parseFloat(String(value)) || 0
    })
    return obj
  })

  const commonProps = {
    data: chartData,
    margin: { top: 5, right: 30, left: 0, bottom: 5 },
  }

  const renderChart = () => {
    switch (type) {
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart {...commonProps}>
              <defs>
                {yKeys.map((key, i) => (
                  <linearGradient
                    key={`gradient-${i}`}
                    id={`color${key}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0.8} />
                    <stop
                      offset="95%"
                      stopColor={COLORS[i % COLORS.length]}
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(210 10% 20%)" />
              <XAxis dataKey={xKey} stroke="hsl(210 10% 65%)" />
              <YAxis stroke="hsl(210 10% 65%)" />
              <Tooltip contentStyle={{ background: 'hsl(210 10% 15%)', border: 'none' }} />
              <Legend />
              {yKeys.map((key, i) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={COLORS[i % COLORS.length]}
                  fillOpacity={1}
                  fill={`url(#color${key})`}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        )

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(210 10% 20%)" />
              <XAxis dataKey={xKey} stroke="hsl(210 10% 65%)" />
              <YAxis stroke="hsl(210 10% 65%)" />
              <Tooltip contentStyle={{ background: 'hsl(210 10% 15%)', border: 'none' }} />
              <Legend />
              {yKeys.map((key, i) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={COLORS[i % COLORS.length]}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey={yKeys[0] || 'value'}
              >
                {yKeys.map((_, i) => (
                  <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'hsl(210 10% 15%)', border: 'none' }} />
            </PieChart>
          </ResponsiveContainer>
        )

      case 'line':
      default:
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart {...commonProps}>
              <defs>
                {yKeys.map((key, i) => (
                  <linearGradient
                    key={`gradient-${i}`}
                    id={`color${key}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0.8} />
                    <stop
                      offset="95%"
                      stopColor={COLORS[i % COLORS.length]}
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(210 10% 20%)" />
              <XAxis dataKey={xKey} stroke="hsl(210 10% 65%)" />
              <YAxis stroke="hsl(210 10% 65%)" />
              <Tooltip contentStyle={{ background: 'hsl(210 10% 15%)', border: 'none' }} />
              <Legend />
              {yKeys.map((key, i) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={COLORS[i % COLORS.length]}
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={true}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )
    }
  }

  return (
    <div className="rounded-lg border border-border bg-secondary/20 p-6">
      {title && <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>}
      {renderChart()}
    </div>
  )
}

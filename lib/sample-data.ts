export function generateSampleData(count: number = 50) {
  const departments = [
    'Marine Operations',
    'Port Management',
    'Coastal Protection',
    'Research & Development',
    'Administration',
  ]
  const categories = [
    'Operating Expenses',
    'Capital Investment',
    'Personnel Costs',
    'Equipment',
    'Maintenance',
  ]

  return Array.from({ length: count }, (_, i) => ({
    id: `MS-${String(i + 1).padStart(5, '0')}`,
    date: new Date(2024, Math.floor(i / 10), (i % 10) + 1)
      .toISOString()
      .split('T')[0],
    department: departments[Math.floor(Math.random() * departments.length)],
    category: categories[Math.floor(Math.random() * categories.length)],
    description: `Transaction ${i + 1} - Marine Department Activity`,
    amount: Math.random() * 50000 + 1000,
    budget: 100000,
    variance: Math.random() * 20000 - 10000,
    status: ['Approved', 'Pending', 'Completed'][Math.floor(Math.random() * 3)],
    approver: ['Administrator', 'Manager', 'Director'][Math.floor(Math.random() * 3)],
    priority: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)],
    compliance: Math.random() > 0.1 ? 'Compliant' : 'Review',
  }))
}

export function generateFinancialMetrics(data: Record<string, unknown>[]) {
  if (data.length === 0) return {}

  const amounts = data
    .map(d => (d as Record<string, unknown>).amount)
    .filter(a => typeof a === 'number')
    .sort((a, b) => (a as number) - (b as number))

  const median =
    amounts.length % 2 === 0
      ? ((amounts[amounts.length / 2 - 1] as number) +
          (amounts[amounts.length / 2] as number)) /
        2
      : (amounts[Math.floor(amounts.length / 2)] as number)

  const sum = amounts.reduce((a, b) => (a as number) + (b as number), 0) as number
  const avg = sum / amounts.length

  return {
    total: sum,
    average: avg,
    median,
    min: Math.min(...(amounts as number[])),
    max: Math.max(...(amounts as number[])),
    count: data.length,
  }
}

export const SAMPLE_COMPLIANCE_INDICATORS = [
  {
    name: 'Budget Compliance',
    status: 'compliant' as const,
    percentage: 94,
    detail: 'Spending within approved budgets',
  },
  {
    name: 'Documentation Complete',
    status: 'compliant' as const,
    percentage: 99,
    detail: 'All transactions properly documented',
  },
  {
    name: 'Approval Chain',
    status: 'warning' as const,
    percentage: 88,
    detail: '3 transactions pending approval',
  },
  {
    name: 'Audit Trail',
    status: 'compliant' as const,
    percentage: 100,
    detail: 'Complete audit trail maintained',
  },
]

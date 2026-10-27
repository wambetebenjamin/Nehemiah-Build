'use client'

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { SpendByCategory, SpendPoint } from '@/lib/types'
import { formatKES } from '@/lib/site'

/**
 * Dashboard charts. Recharts needs an explicit responsive shell: the container is
 * always full width with a fixed height that grows at sm, axis ticks are capped at
 * 11 to 12 pixels, and every series animates in (isAnimationActive is on).
 */
export const CHART_COLORS = {
  materials: '#fc5e28',
  labour: '#040e26',
  professional: '#17a2b8',
  grid: 'rgba(0, 0, 0, 0.06)',
  axis: '#6c757d',
}

const AXIS_TICK = { fontSize: 11, fill: CHART_COLORS.axis } as const
const MOBILE_TICK = { fontSize: 12, fill: CHART_COLORS.axis } as const

function ChartShell({
  title,
  caption,
  children,
  tall = false,
}: {
  title: string
  caption: string
  children: React.ReactNode
  tall?: boolean
}) {
  return (
    <figure className="card mb-0 p-4 sm:p-6" aria-label={title}>
      <figcaption className="mb-4">
        <span className="subheading mb-1">{title}</span>
        <p className="mb-0 text-[13px] leading-relaxed text-[color:var(--gray)]">{caption}</p>
      </figcaption>
      <div className={`h-48 w-full ${tall ? 'sm:h-72' : 'sm:h-64'}`}>
        <ResponsiveContainer width="100%" height="100%">
          {children as React.ReactElement}
        </ResponsiveContainer>
      </div>
    </figure>
  )
}

export function SpendTrendChart({ data }: { data: SpendPoint[] }) {
  return (
    <ChartShell
      title="Spend by month"
      caption="Approved milestone value split into materials, labour and professional fees, month by month."
    >
      <ComposedChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -18 }}>
        <CartesianGrid stroke={CHART_COLORS.grid} vertical={false} />
        <XAxis dataKey="month" tick={AXIS_TICK} tickLine={false} axisLine={{ stroke: CHART_COLORS.grid }} />
        <YAxis
          tick={AXIS_TICK}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value: number) => `${Math.round(value / 100_000) / 10}m`}
          width={54}
        />
        <Tooltip
          formatter={(value: number | string, name: string) => [formatKES(Number(value)), labelFor(name)]}
          contentStyle={{
            borderRadius: 4,
            border: '1px solid rgba(0,0,0,0.08)',
            boxShadow: '0 10px 34px -15px rgba(0,0,0,0.24)',
            fontSize: 13,
          }}
        />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} formatter={labelFor} />
        <Bar dataKey="materials" stackId="spend" fill={CHART_COLORS.materials} isAnimationActive animationDuration={900} />
        <Bar dataKey="labour" stackId="spend" fill={CHART_COLORS.labour} isAnimationActive animationDuration={1100} />
        <Bar
          dataKey="professional"
          stackId="spend"
          fill={CHART_COLORS.professional}
          radius={[3, 3, 0, 0]}
          isAnimationActive
          animationDuration={1300}
        />
        <Line
          type="monotone"
          dataKey="cumulative"
          stroke={CHART_COLORS.materials}
          strokeWidth={2}
          strokeDasharray="4 4"
          dot={false}
          isAnimationActive
          animationDuration={1600}
          legendType="none"
        />
      </ComposedChart>
    </ChartShell>
  )
}

export function CategorySpendChart({ data }: { data: SpendByCategory[] }) {
  return (
    <ChartShell
      title="Where the money went"
      caption="Total approved value per trade on this project, against the budget bands you published."
    >
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, bottom: 0, left: 8 }}>
        <CartesianGrid stroke={CHART_COLORS.grid} horizontal={false} />
        <XAxis
          type="number"
          tick={AXIS_TICK}
          tickLine={false}
          axisLine={{ stroke: CHART_COLORS.grid }}
          tickFormatter={(value: number) => `${Math.round(value / 100_000) / 10}m`}
        />
        <YAxis
          type="category"
          dataKey="category"
          tick={MOBILE_TICK}
          tickLine={false}
          axisLine={false}
          width={92}
          interval={0}
        />
        <Tooltip
          formatter={(value: number | string) => formatKES(Number(value))}
          contentStyle={{
            borderRadius: 4,
            border: '1px solid rgba(0,0,0,0.08)',
            boxShadow: '0 10px 34px -15px rgba(0,0,0,0.24)',
            fontSize: 13,
          }}
        />
        <Bar dataKey="spend" radius={[0, 3, 3, 0]} isAnimationActive animationDuration={1200}>
          {data.map((entry, index) => (
            <Cell key={entry.category} fill={index % 2 === 0 ? CHART_COLORS.materials : CHART_COLORS.labour} />
          ))}
        </Bar>
      </BarChart>
    </ChartShell>
  )
}

export function ProgressAreaChart({ data }: { data: SpendPoint[] }) {
  const withProgress = data.map((point, index) => ({
    ...point,
    planned: Math.round(((index + 1) / data.length) * 5_800_000),
    actual: point.materials + point.labour + point.professional,
    cumulative: data
      .slice(0, index + 1)
      .reduce((sum, item) => sum + item.materials + item.labour + item.professional, 0),
  }))

  return (
    <ChartShell
      title="Planned against actual"
      caption="The line is what the programme said you would have spent by now. The filled area is what you actually approved."
      tall
    >
      <AreaChart data={withProgress} margin={{ top: 4, right: 8, bottom: 0, left: -18 }}>
        <defs>
          <linearGradient id="nb-actual" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CHART_COLORS.materials} stopOpacity={0.35} />
            <stop offset="100%" stopColor={CHART_COLORS.materials} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={CHART_COLORS.grid} vertical={false} />
        <XAxis dataKey="month" tick={AXIS_TICK} tickLine={false} axisLine={{ stroke: CHART_COLORS.grid }} />
        <YAxis
          tick={AXIS_TICK}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value: number) => `${Math.round(value / 100_000) / 10}m`}
          width={54}
        />
        <Tooltip
          formatter={(value: number | string, name: string) => [formatKES(Number(value)), labelFor(name)]}
          contentStyle={{
            borderRadius: 4,
            border: '1px solid rgba(0,0,0,0.08)',
            boxShadow: '0 10px 34px -15px rgba(0,0,0,0.24)',
            fontSize: 13,
          }}
        />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} formatter={labelFor} />
        <Area
          type="monotone"
          dataKey="planned"
          stroke={CHART_COLORS.labour}
          strokeWidth={2}
          fillOpacity={0}
          isAnimationActive
          animationDuration={1000}
        />
        <Area
          type="monotone"
          dataKey="cumulative"
          stroke={CHART_COLORS.materials}
          strokeWidth={2}
          fill="url(#nb-actual)"
          isAnimationActive
          animationDuration={1400}
        />
      </AreaChart>
    </ChartShell>
  )
}

function labelFor(name: string) {
  switch (name) {
    case 'materials':
      return 'Materials'
    case 'labour':
      return 'Labour'
    case 'professional':
      return 'Professional fees'
    case 'cumulative':
      return 'Cumulative approved'
    case 'planned':
      return 'Planned programme'
    case 'actual':
      return 'Actual monthly'
    case 'spend':
      return 'Approved value'
    default:
      return name
  }
}

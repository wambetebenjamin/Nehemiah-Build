'use client'

/**
 * The dashboard charts pull in the whole charting library, which is the heaviest
 * thing on the page and is of no use before hydration. So they are loaded in the
 * browser only, and the cards below reserve the same height while that happens.
 */
import dynamic from 'next/dynamic'
import { TrendingUp } from 'lucide-react'
import type { SpendByCategory, SpendPoint } from '@/lib/types'

const SpendTrendChart = dynamic(() => import('@/components/dashboard-charts').then((mod) => mod.SpendTrendChart), {
  ssr: false,
  loading: () => <ChartSkeleton label="Loading the spend chart" />,
})

const CategorySpendChart = dynamic(
  () => import('@/components/dashboard-charts').then((mod) => mod.CategorySpendChart),
  {
    ssr: false,
    loading: () => <ChartSkeleton label="Loading the trade breakdown" />,
  },
)

function ChartSkeleton({ label }: { label: string }) {
  return (
    <div className="card flex h-[248px] flex-col items-center justify-center gap-3 p-6 text-center sm:h-[280px]">
      <TrendingUp className="h-6 w-6 animate-pulse text-[color:var(--nb-primary)]" aria-hidden="true" />
      <p className="mb-0 text-[13px] text-[color:var(--gray)]">{label}</p>
    </div>
  )
}

export function DashboardCharts({
  spend,
  categories,
}: {
  spend: SpendPoint[]
  categories: SpendByCategory[]
}) {
  return (
    <div className="flex flex-col gap-6">
      <SpendTrendChart data={spend} />
      <CategorySpendChart data={categories} />
    </div>
  )
}

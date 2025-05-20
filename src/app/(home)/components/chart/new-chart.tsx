// NewChart.tsx
import { useChartWarnings } from '@/hooks/useChartWarnings'
import { useSetpointForm } from '@/hooks/useSetPointForm'
import { useAppearanceStore } from '@/stores/useAppearanceStore'
import { ChartProps } from '@/types/chart'
import { useSession } from 'next-auth/react'
import { memo } from 'react'
import { CardCompactView } from './card-compact-view'
import { CardGraphView } from './card-graph-view'

export const NewChart = memo(function NewChart({ dataChart }: ChartProps) {
  const { appearanceMode } = useAppearanceStore()
  const session = useSession()
  const { handleSetPoint, formMethods, verifyValueInSetpoint, mutation } =
    useSetpointForm(dataChart)

  useChartWarnings(dataChart) // apenas chama warnings se necessário

  const commonProps = {
    dataChart,
    formMethods,
    verifyValueInSetpoint,
    onSubmit: formMethods.handleSubmit(handleSetPoint),
    isLoading: mutation.isPending,
    userRole: session.data?.role ?? '',
  }

  return appearanceMode === 'graph' ? (
    <CardGraphView {...commonProps} />
  ) : (
    <CardCompactView {...commonProps} />
  )
})

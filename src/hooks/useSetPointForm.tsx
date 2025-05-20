import { setSetPoint } from '@/app/http/set-setpoint'
import { ChartData } from '@/types/chart'
import { useMutation } from '@tanstack/react-query'
import { CircleCheck, CircleX } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export function useSetpointForm(dataChart: ChartData) {
  const formMethods = useForm()
  const verifyValueInSetpoint = formMethods.watch('setpoint')

  const mutation = useMutation({
    mutationFn: setSetPoint,
    onSuccess: () => {
      toast.success('Setpoint enviado com sucesso', {
        position: 'top-right',
        icon: <CircleCheck />,
      })
      formMethods.reset()
    },
    onError: (error) => {
      toast.error('Erro ao enviar setpoint.', {
        position: 'top-right',
        icon: <CircleX />,
      })
      console.error(error)
    },
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSetPoint = async (data: any) => {
    mutation.mutateAsync({
      id: dataChart.idSitrad,
      model: dataChart.model,
      setpoint: data.setpoint,
    })
  }

  return { handleSetPoint, formMethods, verifyValueInSetpoint, mutation }
}

'use client'
import { setSetPoint } from '@/app/http/set-setpoint'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useModalStore } from '@/stores/useModalStore'
import { ChartData } from '@/types/chart'

import { useMutation } from '@tanstack/react-query'
import { CircleCheck, CircleX } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export function ModalSettingsInstrument() {
  const { modals, toggleModal, data } = useModalStore()
  const { setPoint = 0, differential = 0, name = '' } = data as ChartData
  console.log(setPoint, differential, name)
  const [setPointValue, setSetPointValue] = useState<number>(setPoint)
  const [differentialValue, setDifferentialValue] =
    useState<number>(differential)

  const setSetpointMutation = useMutation({
    mutationFn: setSetPoint,
    onSuccess: () => {
      toast.success('Setpoint enviado com sucesso', {
        position: 'top-right',
        icon: <CircleCheck />,
      })
    },
    onError: (error) => {
      toast.error('Erro ao enviar setpoint.', {
        position: 'top-right',
        icon: <CircleX />,
      })
      console.error(error)
    },
  })
  const setDifferentialMutation = useMutation({
    mutationFn: setDifferential,
    onSuccess: () => {
      toast.success('Diferencial enviado com sucesso', {
        position: 'top-right',
        icon: <CircleCheck />,
      })
    },
    onError: (error) => {
      toast.error('Erro ao enviar diferencial.', {
        position: 'top-right',
        icon: <CircleX />,
      })
      console.error(error)
    },
  })

  return (
    <Dialog
      open={modals['settings-instrument']}
      onOpenChange={() => toggleModal('settings-instrument')}
    >
      <DialogDescription className="sr-only">
        Configuração do Instrumento
      </DialogDescription>
      <DialogContent className="w-11/12 rounded-md md:max-w-3xl lg:max-w-screen-xl">
        <DialogHeader>
          <DialogTitle className="text-sm lg:text-base text-left">
            Parâmetros do Instrumento - {name}
          </DialogTitle>
        </DialogHeader>
        <form className="mt-auto flex items-end gap-2 pt-4">
          <div className="grid gap-1">
            <Label htmlFor="setpoint">Setpoint</Label>
            <Input
              id="setpoint"
              name="setpoint"
              value={setPointValue}
              onChange={(e) => setSetPointValue(Number(e.target.value))}
              maxLength={5}
              type="number"
              step={0.5}
              className="w-full"
            />
            <Button type="submit" className="h-8">
              Enviar
            </Button>
          </div>
          <div className="grid gap-1">
            <Label htmlFor="differential">Diferencial</Label>
            <Input
              id="differential"
              name="differential"
              value={differentialValue}
              onChange={(e) => setDifferentialValue(Number(e.target.value))}
              maxLength={5}
              type="number"
              step={0.5}
              className="w-full"
            />
            <Button type="submit" className="h-8">
              Enviar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

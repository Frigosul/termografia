import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAppearanceStore } from '@/stores/useAppearanceStore'
import { useModalStore } from '@/stores/useModalStore'
import { CircleCheck, CircleX, Loader2, Send } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { memo, useMemo, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'

import { setSetPoint } from '@/app/http/set-setpoint'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
interface ChartProps {
  dataChart: {
    idSitrad: number
    name: string
    model: number
    type: 'temp' | 'press'
    status: string
    isSensorError: boolean
    temperature: number
    pressure: number
    error: string | null
    maxValue: number
    minValue: number
  }
}

const Chart = memo(function Chart({
  dataChart: {
    idSitrad,
    name,
    type,
    model,
    temperature,
    pressure,
    status,
    isSensorError,
    error,
    minValue,
    maxValue,
  },
}: ChartProps) {
  const { register, handleSubmit, watch, reset } = useForm()
  const { openModal } = useModalStore()
  const { appearanceMode } = useAppearanceStore()
  const session = useSession()
  const verifyValueInSetpoint = watch('setpoint')

  const valueInPercent = Math.min(
    Math.max(
      (((type === 'press' ? pressure : temperature) - minValue) /
        (maxValue - minValue)) *
      100,
      0,
    ),
    100,
  )
  const colorInPercent =
    valueInPercent >= 90
      ? 'text-red-600'
      : valueInPercent >= 60
        ? 'text-yellow-600'
        : 'text-primary'
  const data = [
    { value: valueInPercent }, // Filled part
    { value: 100 - valueInPercent }, // Unfilled part
  ]
  const COLORS =
    valueInPercent >= 90
      ? ['#ef4444', '#93b1e4']
      : valueInPercent >= 60
        ? ['#eab308', '#93b1e4']
        : ['#2178db', '#93b1e4']

  const lastWarning = useRef<string | null>(null)
  const removeMask = (value: string) => {
    let result = value.replace(/[^\d,.-]/g, '')
    if (result.includes(',') && !/\d$/.test(result.split(',')[1] || '')) {
      result = result.replace(',', '')
    }
    return result
  }

  const setSetpointMutation = useMutation({
    mutationFn: setSetPoint,
    onSuccess: async () => {
      toast.success('Setpoint enviado com sucesso', {
        position: 'top-right',
        icon: <CircleCheck />,
      })
      reset()
    },
    onError: (error) => {
      toast.error('Erro encontrado, por favor tente novamente. ', {
        position: 'top-right',
        icon: <CircleX />,
      })
      console.error(error)
    },
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function handleSetPoint(data: any) {
    const setPoint = removeMask(data.setpoint)

    setSetpointMutation.mutateAsync({
      id: idSitrad,
      setpoint: setPoint,
      model,
    })
  }

  useMemo(() => {
    const showTemperatureWarning = (id: string, message: string) => {
      toast.warning(message, {
        id,
        position: 'bottom-right',
        closeButton: true,
        duration: 200000,
      })
    }

    if (valueInPercent <= 10 && lastWarning.current !== 'low') {
      showTemperatureWarning(
        name,
        `${type === 'press' ? 'Pressão' : 'Temperatura'} em ${name}, próxima do mínimo permitido`,
      )
      lastWarning.current = 'low'
    } else if (valueInPercent >= 90 && lastWarning.current !== 'high') {
      showTemperatureWarning(
        name,
        `${type === 'press' ? 'Pressão' : 'Temperatura'} em ${name}, próxima do máximo permitido`,
      )
      lastWarning.current = 'high'
    } else if (
      valueInPercent > 10 &&
      valueInPercent < 90 &&
      lastWarning.current !== null
    ) {
      lastWarning.current = null
    }
  }, [valueInPercent, type, name])

  if (appearanceMode === 'graph') {
    return (
      <div
        className={`border-2 rounded-md  ${isSensorError || (error && 'border-red-500/60 opacity-80 bg-red-200/10 dark:bg-red-200/20')}`}
      >
        <div className="flex flex-col items-center justify-center">
          <div className="w-full text-center whitespace-nowrap overflow-hidden text-ellipsis px-2 capitalize mb-2">
            <strong className="font-normal text-xl mb-4 capitalize">
              {name}
            </strong>
          </div>
          <ResponsiveContainer width="93%" height={200}>
            <PieChart>
              <Pie
                data={!error ? data : [{ value: 0 }, { value: 100 }]}
                startAngle={180} // Inicia o arco do topo da metade esquerda
                endAngle={0} // Termina no topo da metade direita
                innerRadius="80%" // Raio interno
                outerRadius="100%" // Raio externo
                dataKey="value" // Valor do gráfico
                stroke="none" // Sem bordas
                max={maxValue}
                min={minValue}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col text-center  mt-[-9.5rem]">
            <p
              className={`${error ? 'sr-only' : 'not-sr-only'} text-center text-sm text-blue-800 dark:text-blue-500`}
            >
              {type === 'temp' ? <span> Temp.</span> : <span>Press.</span>}
            </p>
            <p className={`text-center text-2xl ${colorInPercent}`}>
              {!isSensorError &&
                !error &&
                Number(type === 'press' ? pressure : temperature).toFixed(
                  1,
                )}{' '}
              {!isSensorError && !error ? (
                type === 'temp' ? (
                  '°C'
                ) : (
                  'bar'
                )
              ) : (
                <span className="flex w-28 text-base text-red-700 dark:text-red-500 flex-wrap">
                  {isSensorError
                    ? 'Erro de sensor'
                    : error && 'Falha de comunicação'}
                </span>
              )}
            </p>
          </div>
          <div className="w-[90%]  max-w-[210px] flex justify-between items-center text-xs tracking-tighter leading-4 text-muted-foreground">
            <span className="w-6 text-center">{minValue}</span>
            <span className="w-6 text-center">{maxValue}</span>
          </div>
        </div>
        {type === 'temp' && model !== 78 && (
          <div className="flex justify-between px-1  lg:p-2 flex-wrap">
            {session.data?.role === 'manage' ? (
              <>
                <Button
                  variant="outline"
                  className="text-sm px-0 z-30 gap-3 h-7"
                  onClick={() =>
                    openModal('alert-confirm', undefined, {
                      instrumentId: idSitrad,
                      action: 'Deg',
                      name,
                      model,
                      active: !!status.includes('deg'),
                    })
                  }
                >
                  DEGE.
                  <div
                    className={`size-3 lg:size-4 rounded-full ${status.includes('deg') ? 'bg-emerald-500' : 'bg-zinc-400'}`}
                  />
                </Button>
                {model !== 73 ? (
                  <Button
                    variant="outline"
                    className="text-sm px-0 z-30 gap-3 h-7"
                    onClick={() =>
                      openModal('alert-confirm', undefined, {
                        instrumentId: idSitrad,
                        action: 'Vent',
                        name,
                        model,
                        active: !!status.includes('vent'),
                      })
                    }
                  >
                    VENT.
                    <div
                      className={`size-3 lg:size-4 rounded-full ${status.includes('deg') ? 'bg-emerald-500' : 'bg-zinc-400'}`}
                    />
                  </Button>
                ) : (
                  <span className="text-xs w-16 lg:w-[70px]  font-normal lg:text-sm flex items-center justify-between  gap-3">
                    VENT.
                    <div
                      className={`size-3 lg:size-4 rounded-full ${status.includes('vent') ? 'bg-emerald-500' : 'bg-zinc-400'}`}
                    />
                  </span>
                )}
              </>
            ) : (
              <>
                <span className="text-xs  w-16 lg:w-[70px] font-normal lg:text-sm flex items-center justify-between  gap-3">
                  DEGE.
                  <div
                    className={`size-3 lg:size-4 rounded-full ${status.includes('deg') ? 'bg-emerald-500' : 'bg-zinc-400'}`}
                  />
                </span>
                <span className="text-xs w-16 lg:w-[70px]  font-normal lg:text-sm flex items-center justify-between  gap-3">
                  VENT.
                  <div
                    className={`size-3 lg:size-4 rounded-full ${status.includes('vent') ? 'bg-emerald-500' : 'bg-zinc-400'}`}
                  />
                </span>
              </>
            )}
            <span className="text-xs w-16 lg:w-[70px] font-normal lg:text-sm flex items-center justify-between  gap-3">
              RESF.
              <div
                className={`size-3 lg:size-4 rounded-full ${status.includes('resf') ? 'bg-emerald-500' : 'bg-zinc-400'}`}
              />
            </span>
            <span className="text-xs w-16 lg:w-[70px] font-normal lg:text-sm flex items-center justify-between  gap-3">
              PORT.
              <div
                className={`size-3 lg:size-4 rounded-full ${status.includes('port') ? 'bg-emerald-500' : 'bg-zinc-400'}`}
              />
            </span>
            {session.data?.role === 'manage' && model !== 78 && (
              <form
                onSubmit={handleSubmit(handleSetPoint)}
                className="flex items-center justify-between w-full gap-1 mt-2"
              >
                <Input
                  type="text"
                  {...register('setpoint')}
                  min={minValue}
                  max={maxValue}
                  className="z-30  [appearance:textfield] h-8 dark:bg-slate-900 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="setpoint"
                />
                <Button
                  disabled={
                    !verifyValueInSetpoint || setSetpointMutation.isPending
                  }
                  className="z-30 h-8 px-2"
                >
                  {setSetpointMutation.isPending ? (
                    <Loader2 className="size-5 dark:text-white animate-spin" />
                  ) : (
                    <Send className="size-4 dark:text-white" />
                  )}
                </Button>
              </form>
            )}
          </div>
        )}
      </div>
    )
  } else {
    return (
      <div
        className={`border-2 rounded-md p-2 ${isSensorError || (error && 'border-red-500/60 opacity-80 bg-red-200/10 dark:bg-red-200/20')}`}
      >
        <div className="w-full text-center whitespace-nowrap overflow-hidden text-ellipsis px-2 capitalize">
          <strong className="font-normal text-xl mb-4">{name}</strong>
        </div>
        <div className="flex items-center justify-center gap-2">
          <div
            className={`flex flex-col h-20 justify-between ${type === 'press' ? 'mt-4' : model === 78 && 'mt-4'}`}
          >
            <span className="text-xs text-muted-foreground font-light">
              min: {minValue}
            </span>
            <p className={`text-center text-3xl ${colorInPercent} `}>
              {!isSensorError && !error ? (
                Number(type === 'press' ? pressure : temperature)
              ) : (
                <span className="flex w-28 text-base text-red-700 dark:text-red-500 flex-wrap">
                  {isSensorError
                    ? 'Erro de sensor'
                    : error && 'Falha de comunicação'}
                </span>
              )}
            </p>
            <span className="text-xs text-muted-foreground font-light">
              max: {maxValue}
            </span>
          </div>
          {type === 'temp' && model !== 78 && (
            <div className="flex flex-col justify-between lg:p-2 flex-wrap">
              {session.data?.role === 'manage' ? (
                <>
                  <Button
                    variant="outline"
                    className="text-sm px-[2px] z-30 gap-3 h-6"
                    onClick={() =>
                      openModal('alert-confirm', undefined, {
                        instrumentId: idSitrad,
                        action: 'Deg',
                        name,
                        model,
                        active: !!status.includes('deg'),
                      })
                    }
                  >
                    DEGE.
                    <div
                      className={`!size-3 rounded-full ${status.includes('deg') ? 'bg-emerald-500' : 'bg-zinc-400'}`}
                    />
                  </Button>
                  {model !== 73 ? (
                    <Button
                      variant="outline"
                      className="text-sm px-[2px] z-30 gap-3 h-6"
                      onClick={() =>
                        openModal('alert-confirm', undefined, {
                          instrumentId: idSitrad,
                          action: 'Vent',
                          name,
                          model,
                          active: !!status.includes('vent'),
                        })
                      }
                    >
                      VENT.
                      <div
                        className={`size-3 rounded-full ${status.includes('deg') ? 'bg-emerald-500' : 'bg-zinc-400'}`}
                      />
                    </Button>
                  ) : (
                    <span className="text-xs w-16 lg:w-[70px]  font-normal lg:text-sm flex items-center justify-between h-6  gap-3">
                      VENT.
                      <div
                        className={`size-3 rounded-full ${status.includes('vent') ? 'bg-emerald-500' : 'bg-zinc-400'}`}
                      />
                    </span>
                  )}
                </>
              ) : (
                <>
                  <span className="text-xs  w-16 lg:w-[70px] font-normal lg:text-sm flex items-center justify-between h-6 gap-3">
                    DEGE.
                    <div
                      className={`size-3 rounded-full ${status.includes('deg') ? 'bg-emerald-500' : 'bg-zinc-400'}`}
                    />
                  </span>
                  <span className="text-xs w-16 lg:w-[70px]  font-normal lg:text-sm flex items-center justify-between h-6 gap-3">
                    VENT.
                    <div
                      className={`size-3  rounded-full ${status.includes('vent') ? 'bg-emerald-500' : 'bg-zinc-400'}`}
                    />
                  </span>
                </>
              )}
              <span className="text-xs w-[70px] font-normal lg:text-sm flex items-center justify-between gap-3">
                RESF.
                <div
                  className={`size-3  rounded-full ${status.includes('resf') ? 'bg-emerald-500' : 'bg-zinc-400'}`}
                />
              </span>
              <span className="text-xs w-[70px] font-normal lg:text-sm flex items-center justify-between gap-3">
                PORT.
                <div
                  className={`size-3 rounded-full ${status.includes('port') ? 'bg-emerald-500' : 'bg-zinc-400'}`}
                />
              </span>
            </div>
          )}
        </div>

        {type === 'temp' && model !== 78 && session.data?.role === 'manage' && (
          <form
            onSubmit={handleSubmit(handleSetPoint)}
            className="flex items-center justify-between w-full gap-2 mt-2"
          >
            <Input
              type="text"
              {...register('setpoint')}
              min={minValue}
              max={maxValue}
              className="z-30  [appearance:textfield] h-8 dark:bg-slate-900 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="setpoint"
            />
            <Button
              disabled={!verifyValueInSetpoint || setSetpointMutation.isPending}
              className="z-30 h-8 px-2"
            >
              {setSetpointMutation.isPending ? (
                <Loader2 className="size-5 dark:text-white animate-spin" />
              ) : (
                <Send className="size-4 dark:text-white" />
              )}
            </Button>
          </form>
        )}
      </div>
    )
  }
})

export { Chart }

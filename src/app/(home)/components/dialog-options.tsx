'use client'
import { setFunctionSitrad } from '@/app/http/set-functions-sitrad'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useModalStore } from '@/stores/useModalStore'

export function DialogOptions() {
  const { modals, alertData, toggleModal } = useModalStore()
  if (!alertData) return
  const { instrumentId, name, action, active: statusActive, model } = alertData
  return (
    <AlertDialog
      open={modals['alert-confirm']}
      onOpenChange={() => toggleModal('alert-confirm')}
    >
      <AlertDialogContent className="flex flex-col items-center justify-center">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">
            {action === 'Deg'
              ? !statusActive
                ? `Iniciar o degelo em ${name}`
                : `Parar o degelo em ${name}`
              : action === 'Vent'
                ? !statusActive
                  ? `Ligar o ventilador em ${name}`
                  : `Desligar o ventilador em ${name}`
                : ''}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {!statusActive
              ? `Deseja realmente iniciar o ${action === 'Deg' ? 'Degelo' : 'Ventilador'} em ${name}`
              : `Deseja realmente ${action === 'Deg' ? 'Parar' : 'Desligar'} o ${action === 'Deg' ? 'Degelo' : 'Ventilador'}  em ${name}`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="min-w-28">Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className="min-w-28"
            onClick={async () => {
              await setFunctionSitrad({
                action,
                active: statusActive,
                id: instrumentId,
                model,
              })
            }}
          >
            {statusActive
              ? action === 'Deg'
                ? 'Parar'
                : 'Desligar'
              : action === 'Deg'
                ? 'Iniciar'
                : 'Ligar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { AlertCircle } from 'lucide-react'

export function AlertError() {
  return (
    <AlertDialog defaultOpen>
      <AlertDialogContent className="flex flex-col justify-center text-red-500">
        <div className="flex gap-2 items-center justify-center">
          <AlertCircle className="size-4" />
          <AlertDialogTitle>Serviço Desconectado</AlertDialogTitle>
        </div>
        <AlertDialogDescription className="text-red-500/80 text-center">
          O serviço para leitura das temperaturas está desconectado, por favor
          entre em contato com o suporte!
        </AlertDialogDescription>
      </AlertDialogContent>
    </AlertDialog>
  )
}

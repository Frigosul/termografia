"use client"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { useModalStore } from "@/stores/useModalStore";



export function DialogOptions() {
  const {modals,closeModal,alertData, toggleModal} = useModalStore()
 if(!alertData) return 
 const {instrumentId,name, action} = alertData
  return (
    <AlertDialog
    open={modals['alert-confirm']}
    onOpenChange={() => toggleModal('alert-confirm')}
    >
    <AlertDialogContent className="flex flex-col items-center justify-center">
      <AlertDialogHeader>
        <AlertDialogTitle className="text-center">{action === 'Deg' ? `Iniciar o degelo em ${name} ?` : `Ligar o ventidor em ${name} ?`}</AlertDialogTitle>
        <AlertDialogDescription>{`Deseja realmente iniciar o ${action === 'Deg' ? 'Degelo' : "Ventilador"} em ${name}`}</AlertDialogDescription>

      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel className="min-w-28">Cancelar</AlertDialogCancel>
        <AlertDialogAction className="min-w-28" 
        // colocar a função que envia o comando para o sitrad
        onClick={() => console.log(instrumentId)}
        >{action === 'Deg' ? "Iniciar" : "Ligar"}</AlertDialogAction>

      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
  
  )
}
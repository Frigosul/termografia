"use client"
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Trash2 } from "lucide-react";


export function DeleteUser() {

  function handleDeleteUser(id: string) {
    console.log(id)
  }

  return (
    <Dialog>
      <DialogTrigger className="flex gap-2 text-muted-foreground font-normal items-center justify-center hover:text-foreground">
        <Trash2 size={20} />
        Excluir
      </DialogTrigger>
      <DialogContent >
        <DialogHeader className="flex items-center justify-center pb-4 border-b">
          <Trash2 className="text-red-600" size={48} />
          <DialogTitle className="font-normal pt-4 pb-1">Excluir Usuário</DialogTitle>
        </DialogHeader>

        <form onSubmit={() => handleDeleteUser('id-user')} className="flex gap-5 mx-auto">
          <Button variant="outline" type="button" size="sm">Cancelar</Button>
          <Button type="submit" size="sm" className="bg-red-500 hover:bg-red-600">Excluir</Button>

        </form>
      </DialogContent>
    </Dialog>

  )
}
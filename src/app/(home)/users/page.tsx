import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { EllipsisVertical } from "lucide-react";
import { CreateUser } from "./components/create-user";
import { DeleteUser } from "./components/delete-user";
import { UpdateUser } from "./components/update-user";

export default function Register() {

  return (
    <div className="flex items-start">

      <main className="px-8  flex-1 gap-2  mt-20 items-start">
        <div className="flex justify-between items-center w-full my-4">
          <h2 className="font-normal tracking-tight text-foreground ">Gerencie usuários Termografia</h2>
          <CreateUser />
        </div>
        <Table className="border border-collapse rounded-md">
          <TableHeader>
            <TableRow>
              <TableHead className="border"  >Nome</TableHead>
              <TableHead className="border" >E-mail</TableHead>
              <TableHead className="border" >Tipo de Usuário</TableHead>
              <TableHead className="border" >Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody >

            {Array.from({ length: 5 }).map((_, i) => {
              return (
                <TableRow key={i} className="odd:bg-white odd:dark:bg-slate-950 even:bg-slate-50 even:dark:bg-slate-900">
                  <TableCell className="border"  >João Dias</TableCell>
                  <TableCell className="border" >suporte2.apms@frigosul.com.br</TableCell>
                  <TableCell className="border" >Administrador</TableCell>
                  <TableCell className="text-center w-4 border ">
                    <Popover>
                      <PopoverTrigger className="h-4">
                        <EllipsisVertical size={18} />
                      </PopoverTrigger>
                      <PopoverContent className="space-y-2 w-30 mr-9">

                        <UpdateUser />
                        <DeleteUser />

                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              )
            })}




          </TableBody>

        </Table>
      </main>
    </div>
  )

}
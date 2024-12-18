'use client'

import { TableManagedUnions } from './components/table-manage-unions'
import { TableManagedEquipments } from './components/table-managed-equipments'

export default function PageManagedEquipments() {

  return (
    <main className="overflow-y-auto flex-1 flex flex-col p-4 sm:p-6 md:p-6">
      <h2 className="font-normal tracking-tight mb-4 text-foreground text-sm md:text-base">
        Gerenciar Equipamentos
      </h2>
      <TableManagedEquipments />
      <h2 className="font-normal tracking-tight my-4 text-foreground text-sm md:text-base">
        Gerenciar Uniões
      </h2>
      <TableManagedUnions />
    </main>
  )
}

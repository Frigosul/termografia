'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TableManagedEquipments } from '../managed-equipments/components/table-managed-equipments'

export default function PageManagedEquipments() {
  return (
    <div className="h-[calc(100vh_-_7.5rem)]  overflow-y-scroll">
      <Card className="w-3/4 mx-auto mt-4 bg-muted  dark:bg-slate-800 shadow-sm  p-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl tracking-tight text-blue-600 dark:text-blue-500 underline">
            Gerenciar Equipamentos
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-muted dark:bg-slate-800 pt-4">
          <TableManagedEquipments />
        </CardContent>
      </Card>
    </div>
  )
}

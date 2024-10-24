'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TableManagedEquipments } from './components/table-managed-equipments'

export default function PageManagedEquipments() {
  return (
    <div className="flex-1 py-4 overflow-hidden">
      <Card className="w-4/5 max-w-6xl flex flex-col h-full mx-auto shadow-sm bg-muted dark:bg-slate-800 overflow-hidden">
        <CardHeader className="pb-1">
          <CardTitle className="text-xl tracking-tight text-blue-600 dark:text-blue-500">
            Gerenciar Equipamentos
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-muted dark:bg-slate-800 flex-1 flex overflow-hidden">
          <TableManagedEquipments />
        </CardContent>
      </Card>
    </div>
  )
}

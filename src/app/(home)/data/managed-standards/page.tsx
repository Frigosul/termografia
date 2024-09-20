'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { FormManagedStandards } from './components/form-managed-standards'
import { TableManagedData } from './components/table-managed-data'
export default function PageManagedStandards() {
  return (
    <div className="h-[calc(100vh_-_7.5rem)]  overflow-y-scroll">
      <Card className="w-3/4 mx-auto mt-4 bg-muted dark:bg-slate-800 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl tracking-tight text-blue-600 dark:text-blue-500 underline">
            Gerenciar Padrões
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormManagedStandards />
        </CardContent>
      </Card>
      <Card className="w-3/4 mx-auto mt-4 bg-muted  dark:bg-slate-800 shadow-sm  p-4">
        <CardTitle className="text-sm">
          Correção de dados dos coletores
        </CardTitle>
        <CardContent className="bg-muted  dark:bg-slate-800 pt-4">
          <TableManagedData />
        </CardContent>
      </Card>
    </div>
  )
}

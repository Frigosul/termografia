'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { ScrollArea } from '@/components/ui/scroll-area'
import { FormManagedStandards } from './components/form-managed-standards'
import { TableManagedStandards } from './components/table-managed-standards'
export default function PageManagedStandards() {
  return (
    <ScrollArea className='flex-1'>
      <div className="grid grid-cols-1 mx-auto px-2 gap-2 py-3">
        <Card className="w-4/5 max-w-6xl mx-auto mt-4 bg-muted dark:bg-slate-800 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl tracking-tight text-blue-600 dark:text-blue-500 underline">
              Gerenciar Padrões
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FormManagedStandards />
          </CardContent>
        </Card>
        <Card className="w-4/5 max-w-6xl mx-auto my-4 bg-muted  dark:bg-slate-800 shadow-sm  p-4">
          <CardTitle className="text-sm">
            Correção de dados dos coletores
          </CardTitle>
          <CardContent className="bg-muted  dark:bg-slate-800 pt-4">
            <TableManagedStandards />
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  )
}

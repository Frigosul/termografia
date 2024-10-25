'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { ScrollArea } from '@/components/ui/scroll-area'
import { FormManagedData } from './components/form-managed-data'
import { TableManagedData } from './components/table-managed-data'
export default function PageManagedData() {
  return (
    <ScrollArea className='flex-1 '>
      <div className="grid grid-cols-1 mx-auto px-2 gap-2 py-3">
        <Card className="lg:w-4/5 lg:max-w-6xl lg:mx-auto md:mt-4 bg-muted  dark:bg-slate-800 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl tracking-tight text-blue-600 dark:text-blue-500 underline">
              Gerenciar Dados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FormManagedData />
          </CardContent>
        </Card>
        <Card className="lg:w-4/5 lg:max-w-6xl lg:mx-auto md:mt-4 bg-muted  dark:bg-slate-800 shadow-sm p-4">
          <CardTitle className="text-sm">
            Correção de dados dos coletores
          </CardTitle>
          <CardContent className="bg-muted  dark:bg-slate-800 pt-4">
            <TableManagedData />
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  )
}

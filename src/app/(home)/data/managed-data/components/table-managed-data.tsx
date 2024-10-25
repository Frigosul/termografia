import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { zodResolver } from '@hookform/resolvers/zod'
import { Minus, Plus, Save, Search, X } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

interface RowData {
  id: number
  dateTime: string
  temperature: number
  status: string
}
const searchParams = ['igual à', 'menor ou igual à', 'maior ou igual à']
const searchDataSchema = z.object({
  hour: z.string(),
  searchParams: z.string().refine((value) => searchParams.includes(value), {
    message:
      'Parâmetro de pesquisa inválido. Escolha um dos valores disponíveis.',
  }),
  temperature: z.string(),
})

type SearchData = z.infer<typeof searchDataSchema>

export function TableManagedData() {
  const { control, register, handleSubmit } = useForm<SearchData>({
    resolver: zodResolver(searchDataSchema),
  })

  function handleSearchData(data: SearchData) {
    console.log(data)
  }

  const [data, setData] = useState<RowData[]>([
    {
      id: 1,
      dateTime: '17/08/2024 - 12:23',
      temperature: 2.5,
      status: 'Temperatura Integrada',
    },
    {
      id: 2,
      dateTime: '17/08/2024 - 12:23',
      temperature: 3.5,
      status: 'Temperatura Integrada',
    },
    {
      id: 3,
      dateTime: '17/08/2024 - 12:23',
      temperature: 4.5,
      status: 'Temperatura Integrada',
    },
    {
      id: 4,
      dateTime: '17/08/2024 - 12:23',
      temperature: 6.6,
      status: 'Temperatura Integrada',
    },
    {
      id: 5,
      dateTime: '17/08/2024 - 12:23',
      temperature: 11.0,
      status: 'Temperatura Integrada',
    },
    {
      id: 6,
      dateTime: '17/08/2024 - 12:23',
      temperature: 11.0,
      status: 'Temperatura Integrada',
    },
    {
      id: 7,
      dateTime: '17/08/2024 - 12:23',
      temperature: 2.5,
      status: 'Temperatura Integrada',
    },
    {
      id: 8,
      dateTime: '17/08/2024 - 12:23',
      temperature: 3.5,
      status: 'Temperatura Integrada',
    },
    {
      id: 9,
      dateTime: '17/08/2024 - 12:23',
      temperature: 4.5,
      status: 'Temperatura Integrada',
    },
    {
      id: 10,
      dateTime: '17/08/2024 - 12:23',
      temperature: 6.6,
      status: 'Temperatura Integrada',
    },
    {
      id: 11,
      dateTime: '17/08/2024 - 12:23',
      temperature: 11.0,
      status: 'Temperatura Integrada',
    },
    {
      id: 12,
      dateTime: '17/08/2024 - 12:23',
      temperature: 11.0,
      status: 'Temperatura Integrada',
    },
  ])

  const [editCell, setEditCell] = useState<{
    rowId: number | null
    field: keyof RowData | null
  }>({
    rowId: null,
    field: null,
  })

  const [inputValue, setInputValue] = useState<string>('')

  // Função para ativar a edição
  function handleDoubleClick(
    rowId: number,
    field: keyof RowData,
    currentValue: string | number,
  ) {
    setEditCell({ rowId, field })
    setInputValue(currentValue.toString())
  }

  // Função para salvar a edição
  function handleSave(rowId: number, field: keyof RowData) {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === rowId
          ? {
            ...item,
            [field]:
              field === 'temperature' ? Number(inputValue) : inputValue,
          }
          : item,
      ),
    )
    setEditCell({ rowId: null, field: null })
  }

  // Função para salvar a célula e mover para a próxima linha ou coluna
  function handleSaveAndMove(rowId: number, field: keyof RowData) {
    handleSave(rowId, field) // Salva a célula atual
    const nextRowId = getNextRowId(rowId, 1) // Calcula o próximo ID de linha

    if (nextRowId !== null) {
      moveToNextCell(nextRowId, field) // Move o foco para a célula abaixo
    } else {
      // Se for a última linha, mover para a próxima coluna
      const nextField = getNextField(field)
      if (nextField) {
        moveToNextCell(data[0].id, nextField) // Move o foco para a primeira célula da próxima coluna
      }
    }
  }

  // Função para navegar para cima ou para baixo
  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>,
    rowId: number,
    field: keyof RowData,
  ) {
    if (e.key === 'Enter') {
      handleSaveAndMove(rowId, field)
    }
    if (e.key === 'ArrowDown') {
      const nextRowId = getNextRowId(rowId, 1)
      if (nextRowId !== null) {
        moveToNextCell(nextRowId, field)
      }
    } else if (e.key === 'ArrowUp') {
      const prevRowId = getNextRowId(rowId, -1)
      if (prevRowId !== null) {
        moveToNextCell(prevRowId, field)
      }
    }
  }
  // Função para obter a próxima coluna (campo) da tabela
  function getNextField(currentField: keyof RowData): keyof RowData | null {
    const fields: (keyof RowData)[] = ['dateTime', 'temperature']
    const currentIndex = fields.indexOf(currentField)
    const nextIndex = currentIndex + 1
    if (nextIndex < fields.length) {
      return fields[nextIndex]
    }
    return null
  }
  // Função para mover o foco para a célula selecionada
  function moveToNextCell(nextRowId: number, field: keyof RowData) {
    const nextRow = data.find((row) => row.id === nextRowId)
    if (nextRow) {
      setEditCell({ rowId: nextRowId, field })
      if (nextRow[field]) {
        setInputValue(nextRow[field].toString())
      }
    }
  }

  // Função para obter o próximo rowId (navegação com setas)
  function getNextRowId(currentId: number, direction: number): number | null {
    const currentIndex = data.findIndex((row) => row.id === currentId)
    const nextIndex = currentIndex + direction

    if (nextIndex >= 0 && nextIndex < data.length) {
      return data[nextIndex].id
    }

    return null
  }

  return (
    <div className="flex flex-col w-full items-center justify-between border border-card-foreground rounded-md h-[30rem] overflow-hidden relative">
      <div className="flex justify-between w-full border-b border-card-foreground">
        <div className="flex gap-1">
          <Button variant="ghost" className="flex gap-1 hover:bg-blue-600/40">
            <Plus className="size-4" />
            Adicionar
          </Button>
          <Button variant="ghost" className="flex gap-1 hover:bg-yellow-400/30">
            <Minus className="size-4" />
            Apagar
          </Button>
          <Button variant="ghost" className="flex gap-1 hover:bg-green-400/30">
            <Save className="size-4" />
            Salvar
          </Button>
          <Button variant="ghost" className="flex gap-1 hover:bg-red-400/30">
            <X className="size-4" />
            Cancelar
          </Button>
        </div>
        <form
          className="flex items-center justify-center gap-2"
          onSubmit={handleSubmit(handleSearchData)}
        >
          <Input
            {...register('hour')}
            placeholder="Hora"
            type="time"
            className="w-22"
          />
          <Controller
            name="searchParams"
            control={control}
            render={({ field: { onChange, value, ref } }) => (
              <Select onValueChange={onChange} value={value}>
                <SelectTrigger
                  ref={ref}
                  className="dark:bg-slate-900 w-[20rem]"
                >
                  <SelectValue placeholder="Igual à" />
                </SelectTrigger>
                <SelectContent className="w-[20rem]">
                  <SelectItem value="equal">Igual à</SelectItem>
                  <SelectItem value="lessOrEqual">Menor ou igual à</SelectItem>
                  <SelectItem value="greaterOrEqual">
                    Maior ou igual à
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          <Input
            {...register('temperature')}
            placeholder="ºC"
            className="w-20"
          />
          <Button
            variant="default"
            className="flex items-center justify-center rounded-none hover:bg-slate-300"
          >
            <Search />
          </Button>
        </form>
      </div>
      <Table className="border border-collapse rounded-md">
        <TableHeader className="bg-card sticky z-10 top-0 border-b">
          <TableRow>
            <TableHead className="border text-card-foreground w-64 text-center ">
              Data - Hora
            </TableHead>
            <TableHead className="border text-card-foreground w-20 text-center ">
              Temperatura
            </TableHead>
            <TableHead className="border text-card-foreground ">
              Status de alteração
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="overflow-y-auto">
          {data.map((row) => {
            return (
              <TableRow
                key={row.id}
                className="odd:bg-white odd:dark:bg-slate-950 even:bg-slate-50 even:dark:bg-slate-900 "
              >
                <TableCell
                  className="border text-center"
                  onDoubleClick={() =>
                    handleDoubleClick(row.id, 'dateTime', row.dateTime)
                  }
                >
                  {editCell.rowId === row.id &&
                    editCell.field === 'dateTime' ? (
                    <input
                      className="bg-transparent w-full"
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onBlur={() => handleSave(row.id, 'dateTime')}
                      onKeyDown={(e) => handleKeyDown(e, row.id, 'dateTime')}
                      autoFocus
                    />
                  ) : (
                    row.dateTime
                  )}
                </TableCell>
                <TableCell
                  className="border text-center"
                  onDoubleClick={() =>
                    handleDoubleClick(row.id, 'temperature', row.temperature)
                  }
                >
                  {editCell.rowId === row.id &&
                    editCell.field === 'temperature' ? (
                    <input
                      className="bg-transparent w-full"
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onBlur={() => handleSave(row.id, 'temperature')}
                      onKeyDown={(e) => handleKeyDown(e, row.id, 'temperature')}
                      autoFocus
                    />
                  ) : (
                    `${row.temperature} ºC`
                  )}
                </TableCell>
                <TableCell className="border">{row.status}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

import { updateData } from '@/app/http/update-data'
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
import { formattedDateTime } from '@/utils/formatted-datetime'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { CircleCheck, CircleX, Save, Search, X } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

interface TableRow {
  id: string
  time: string
  value: number
  updatedUserAt: string | null
  updatedAt: string
}

interface TableProps {
  data: TableRow[]
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

export function TableUpdateData({ data }: TableProps) {
  const { data: session } = useSession()
  const queryClient = useQueryClient()

  const updatedDataMutation = useMutation({
    mutationFn: updateData,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['list-data'] })
      toast.success('Dados atualizados com sucesso', {
        position: 'top-right',
        icon: <CircleCheck />,
      })
    },
    onError: (error) => {
      toast.error('Erro encontrado, por favor tente novamente', {
        position: 'top-right',
        icon: <CircleX />,
      })
      console.error(error)
    },
  })

  const { control, register } = useForm<SearchData>({
    resolver: zodResolver(searchDataSchema),
  })

  const [editData, setEditData] = useState<TableProps>({ data })

  const [editCell, setEditCell] = useState<{
    rowId: string | null
    field: keyof TableRow | null
  }>({
    rowId: null,
    field: null,
  })

  const [inputValue, setInputValue] = useState<string>('')

  function handleDoubleClick(
    rowId: string,
    field: keyof TableRow,
    currentValue: string | number,
  ) {
    setEditCell({ rowId, field })

    const valueAsString =
      field === 'time'
        ? dayjs(currentValue).format('YYYY-MM-DD HH:mm')
        : currentValue.toString()

    setInputValue(valueAsString)
  }

  function handleSave(rowId: string, field: keyof TableRow) {
    const originalValue = data.find((row) => row.id === rowId)
    const formattedValue =
      field === 'time' && originalValue
        ? dayjs(originalValue[field]).format('YYYY-MM-DD HH:mm')
        : originalValue?.[field]?.toString() || ''

    if (inputValue !== '' && inputValue !== formattedValue) {
      setEditData((prevData) => ({
        data:
          prevData?.data.map((item) => {
            return item.id === rowId
              ? {
                ...item,
                [field]: field === 'value' ? Number(inputValue) : inputValue,
                updatedUserAt: String(session?.user?.name),
                updatedAt: dayjs().format('YYYY-MM-DDTHH:mm'),
              }
              : item
          }) || [],
      }))
    }
    setEditCell({ rowId: null, field: null })
  }

  function handleSaveAndMove(rowId: string, field: keyof TableRow) {
    handleSave(rowId, field)
    const nextRowId = getNextRowId(rowId, 1)

    if (nextRowId !== null) {
      moveToNextCell(nextRowId, field)
    } else {
      const nextField = getNextField(field)
      if (nextField) {
        moveToNextCell(data[0].id, nextField)
      }
    }
  }

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>,
    rowId: string,
    field: keyof TableRow,
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

  function getNextField(currentField: keyof TableRow): keyof TableRow | null {
    const fields: (keyof TableRow)[] = ['time', 'value']
    const currentIndex = fields.indexOf(currentField)
    const nextIndex = currentIndex + 1
    return nextIndex < fields.length ? fields[nextIndex] : null
  }

  function moveToNextCell(nextRowId: string, field: keyof TableRow) {
    const nextRow = data.find((row) => row.id === nextRowId)
    if (nextRow && nextRow[field]) {
      setEditCell({ rowId: nextRowId, field })

      const valueAsString =
        field === 'time'
          ? dayjs(nextRow[field]).format('YYYY-MM-DD HH:mm')
          : nextRow[field]?.toString() || ''

      setInputValue(valueAsString)
    }
  }

  function getNextRowId(currentId: string, direction: number): string | null {
    const currentIndex = data.findIndex((row) => row.id === currentId)
    const nextIndex = currentIndex + direction
    return nextIndex >= 0 && nextIndex < data.length ? data[nextIndex].id : null
  }

  return (
    <div className="flex flex-col w-full items-center justify-start border border-card-foreground rounded-md h-[30rem] overflow-hidden relative">
      <div className="flex justify-between w-full border-b border-card-foreground">
        <div className="flex gap-1">
          <Button
            variant="ghost"
            className="flex gap-1 hover:bg-green-400/30"
            disabled={updatedDataMutation.isPending}
            onClick={() =>
              updatedDataMutation.mutateAsync({ dataValue: editData.data })
            }
          >
            <Save className="size-4" />
            Salvar
          </Button>
          <Button variant="ghost" className="flex gap-1 hover:bg-red-400/30">
            <X className="size-4" />
            Cancelar
          </Button>
        </div>
        <form className="flex items-center justify-center gap-2">
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
          {editData.data.map((row) => {
            return (
              <TableRow
                key={row.id}
                className="odd:bg-white odd:dark:bg-slate-950 even:bg-slate-50 even:dark:bg-slate-900"
              >
                <TableCell className="border text-center">
                  {formattedDateTime(row.time)}
                </TableCell>
                <TableCell
                  className="border text-center p-0 h-4"
                  onDoubleClick={() =>
                    handleDoubleClick(row.id, 'value', row.value)
                  }
                >
                  {editCell.rowId === row.id && editCell.field === 'value' ? (
                    <input
                      className="bg-transparent w-full h-full  text-center m-0"
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onBlur={() => handleSave(row.id, 'value')}
                      onKeyDown={(e) => handleKeyDown(e, row.id, 'value')}
                      autoFocus
                    />
                  ) : (
                    `${row.value} ºC`
                  )}
                </TableCell>
                <TableCell className="border">
                  {row.updatedUserAt
                    ? `Temperatura alterada por ${row.updatedUserAt} em ${formattedDateTime(row.updatedAt)}`
                    : `Temperatura integrada`}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

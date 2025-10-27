/* eslint-disable prettier/prettier */
'use client'

import { updateData } from '@/app/http/update-data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination'
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
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { normalizeAndMergeKeepIds } from '@/utils/normalize-and-merge-keep-ids'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CircleCheck,
  CircleX,
  Search,
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { TableRowEdit, type EditableField } from './table-row-edit'

dayjs.extend(customParseFormat)
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)

interface TableRowBase {
  id: string
  time: string
  updatedUserAt?: string | null
  updatedAt?: string
}

interface TableRow extends TableRowBase {
  temperatureId?: string | null
  pressureId?: string | null
  temperature?: number
  pressure?: number
  updatedUserAtTemp?: string | null
  updatedUserAtPress?: string | null
  updatedAtTemp?: string
  updatedAtPress?: string
}

interface TableProps {
  data?: TableRow[]
  dataPressure?: TableRow[]
  instrumentType?: 'PRESSURE' | 'TEMPERATURE'
  joinInstruments?: boolean
}

const searchDataSchema = z.object({
  search: z.string(),
  searchParams: z.string(),
})

type SearchData = z.infer<typeof searchDataSchema>

const ITEMS_PER_PAGE = 50

export function TableEditValues({
  data,
  dataPressure = [],
  instrumentType,
  joinInstruments,
}: TableProps) {
  const { data: session } = useSession()
  const queryClient = useQueryClient()

  const mergedNormalized = useMemo(() => {
    if (joinInstruments) {
      return normalizeAndMergeKeepIds(data ?? [], dataPressure ?? [])
    }

    if (instrumentType === 'TEMPERATURE') {
      return normalizeAndMergeKeepIds(data ?? [], [])
    }

    if (instrumentType === 'PRESSURE') {
      return normalizeAndMergeKeepIds([], dataPressure ?? [])
    }

    return []
  }, [data, dataPressure, joinInstruments, instrumentType])


  const [tableData, setTableData] = useState<TableRow[]>(mergedNormalized)

  useEffect(() => {
    setTableData((prev) => {
      const sameLength = prev.length === mergedNormalized.length
      const sameContent = sameLength && prev.every((p, i) =>
        p.id === mergedNormalized[i].id &&
        p.temperature === mergedNormalized[i].temperature &&
        p.pressure === mergedNormalized[i].pressure
      )

      if (sameContent) return prev
      return mergedNormalized
    })
    setCurrentPage(1)
  }, [mergedNormalized])



  const [editCell, setEditCell] = useState<{
    rowId: string | null
    field: EditableField | null
  }>({
    rowId: null,
    field: null,
  })
  const [inputValue, setInputValue] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(tableData.length / ITEMS_PER_PAGE)

  const paginatedData = useMemo(
    () =>
      tableData.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
      ),
    [tableData, currentPage],
  )

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

  const { control, register, handleSubmit } = useForm<SearchData>({
    resolver: zodResolver(searchDataSchema),
  })

  function handleSearchData(searchData: SearchData) {
    const { search, searchParams } = searchData
    const searchDate = dayjs(search, 'DD/MM/YYYY - HH:mm', true)
    const searchValue = parseFloat(search)

    const filtered = tableData.filter((row) => {
      const rowDate = dayjs(row.time)
      const rowValue = row.temperature ?? row.pressure ?? 0

      if (searchDate.isValid()) {
        switch (searchParams) {
          case 'equal':
            return rowDate.isSame(searchDate, 'minute')
          case 'lessOrEqual':
            return rowDate.isSameOrBefore(searchDate, 'minute')
          case 'greaterOrEqual':
            return rowDate.isSameOrAfter(searchDate, 'minute')
          default:
            return true
        }
      } else if (!isNaN(searchValue)) {
        switch (searchParams) {
          case 'equal':
            return rowValue === searchValue
          case 'lessOrEqual':
            return rowValue <= searchValue
          case 'greaterOrEqual':
            return rowValue >= searchValue
          default:
            return true
        }
      }
      return true
    })

    setTableData(filtered)
    setCurrentPage(1)
  }

  function handleDoubleClick(
    rowId: string,
    field: EditableField,
    currentValue: string | number,
  ) {
    setEditCell({ rowId, field })
    setInputValue(
      field === 'time'
        ? dayjs(currentValue).format('YYYY-MM-DD HH:mm')
        : String(currentValue),
    )
  }

  function handleSave(rowId: string, field: EditableField, valueToSave: string) {
    setTableData((prev) =>
      prev.map((r) => {
        if (r.id !== rowId) return r

        const now = dayjs().toISOString()

        if (field === 'temperature') {
          const valNum = Number(valueToSave)
          // Se o valor não mudou, retorna o registro original
          if (r.temperature === valNum || isNaN(valNum)) return r

          return {
            ...r,
            temperature: valNum,
            // NÃO sobrescrever temperatureId
            updatedUserAtTemp: session?.user?.name ?? r.updatedUserAtTemp,
            updatedAtTemp: now,
          }
        }

        if (field === 'pressure') {
          const valNum = Number(valueToSave)
          // Se o valor não mudou, retorna o registro original
          if (r.pressure === valNum || isNaN(valNum)) return r

          return {
            ...r,
            pressure: valNum,
            // NÃO sobrescrever pressureId
            updatedUserAtPress: session?.user?.name ?? r.updatedUserAtPress,
            updatedAtPress: now,
          }
        }

        if (field === 'time') {
          if (r.time === String(valueToSave)) return r
          return {
            ...r,
            time: String(valueToSave),
          }
        }

        return r
      }),
    )
  }


  function getNextRowId(currentId: string, direction: number): string | null {
    const currentIndex = tableData.findIndex((row) => row.id === currentId)
    const nextIndex = currentIndex + direction
    return nextIndex >= 0 && nextIndex < tableData.length
      ? tableData[nextIndex].id
      : null
  }

  function getNextField(currentField: EditableField): EditableField | null {
    const fields: EditableField[] = ['time', 'pressure', 'temperature']
    const currentIndex = fields.indexOf(currentField)
    const nextIndex = currentIndex + 1
    return nextIndex < fields.length ? fields[nextIndex] : null
  }

  function moveToNextCell(nextRowId: string, field: EditableField) {
    const nextRow = tableData.find((row) => row.id === nextRowId)
    if (!nextRow) return

    const valueAsString =
      field === 'time'
        ? dayjs(nextRow[field]).format('YYYY-MM-DD HH:mm')
        : String(nextRow[field] ?? '')

    setEditCell({ rowId: nextRowId, field })
    setInputValue(valueAsString)
  }

  function handleSaveAndMove(rowId: string, field: EditableField) {

    handleSave(rowId, field, inputValue)
    const nextRowId = getNextRowId(rowId, 1)
    if (nextRowId) moveToNextCell(nextRowId, field)
    else {
      const nextField = getNextField(field)
      if (nextField) moveToNextCell(tableData[0].id, nextField)
    }
  }

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>,
    rowId: string,
    field: EditableField,
  ) {
    if (e.key === 'Enter') handleSaveAndMove(rowId, field)
    else if (e.key === 'ArrowDown') {
      const nextRowId = getNextRowId(rowId, 1)
      if (nextRowId) moveToNextCell(nextRowId, field)
    } else if (e.key === 'ArrowUp') {
      const prevRowId = getNextRowId(rowId, -1)
      if (prevRowId) moveToNextCell(prevRowId, field)
    } else if (e.key === 'Escape') {
      setEditCell({ rowId: null, field: null })
      setInputValue('')
    }
  }

  async function onSaveClick() {
    const dataValue = tableData.flatMap((row) => {
      const items: {
        id: string
        value: number
        updatedAt: string
        updatedUserAt: string | null
      }[] = []

      if (row.temperature !== undefined && row.temperatureId) {
        items.push({
          id: row.temperatureId,
          value: row.temperature,
          updatedAt: row.updatedAtTemp ?? new Date().toISOString(),
          updatedUserAt: row.updatedUserAtTemp ?? null,
        })
      }

      if (row.pressure !== undefined && row.pressureId) {
        items.push({
          id: row.pressureId,
          value: row.pressure,
          updatedAt: row.updatedAtPress ?? new Date().toISOString(),
          updatedUserAt: row.updatedUserAtPress ?? null,
        })
      }

      return items
    })

    console.log("payload final:", dataValue)

    await updatedDataMutation.mutateAsync({ dataValue })
  }

  return (
    <div className="flex-grow flex flex-col max-h-[55vh] max-w-screen-2xl overflow-hidden">
      {/* Header: salvar/cancelar e pesquisa */}
      <div className="flex w-full items-center gap-2 p-1 h-11 border rounded-t-md justify-between">
        <div className="flex border rounded-md">
          <Button
            variant="ghost"
            className="h-8 flex items-center justify-center text-sm"
            disabled={updatedDataMutation.isPending}
            onClick={onSaveClick}
          >
            Salvar
          </Button>
          <Button
            variant="ghost"
            className="h-8 flex items-center justify-center text-sm"
          >
            Cancelar
          </Button>
        </div>

        <form
          className="flex items-center gap-2"
          onSubmit={handleSubmit(handleSearchData)}
        >
          <Controller
            name="searchParams"
            control={control}
            render={({ field: { onChange, value, ref } }) => (
              <Select onValueChange={onChange} value={value}>
                <SelectTrigger ref={ref} className="dark:bg-slate-900 w-48 h-8">
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
            {...register('search')}
            placeholder="Pesquisar"
            className="w-48 h-8"
          />
          <Button type="submit" className="h-8">
            <Search className="size-5" />
          </Button>
        </form>
      </div>

      {/* Tabela */}
      <Table className="border-collapse">
        <TableHeader className="bg-card sticky z-10 top-0 border-b">
          <TableRow>
            <TableHead className="border text-card-foreground w-64 text-center">
              Data - Hora
            </TableHead>
            {joinInstruments ? (
              <>
                <TableHead className="border text-card-foreground w-20 text-center">
                  Temperatura
                </TableHead>
                <TableHead className="border text-card-foreground w-20 text-center">
                  Pressão
                </TableHead>
              </>
            ) : (
              <TableHead className="border text-card-foreground w-20 text-center">
                {instrumentType === 'PRESSURE' ? 'Pressão' : 'Temperatura'}
              </TableHead>
            )}
            <TableHead className="border text-card-foreground">
              Status de alteração
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="overflow-y-auto">
          {paginatedData.map((row) => {
            const rowKey = row.id ?? row.temperatureId ?? row.pressureId ?? row.time

            return (
              <TableRowEdit
                key={rowKey}
                row={row}
                joinInstruments={joinInstruments}
                editCell={editCell}
                inputValue={inputValue}
                setInputValue={setInputValue}
                handleDoubleClick={handleDoubleClick}
                handleSave={handleSave}
                handleKeyDown={handleKeyDown}
                instrumentType={instrumentType}
              />
            )
          })}
        </TableBody>
      </Table>

      <div className="text-sm border rounded-b-md flex items-center px-2 justify-between">
        <span className="w-44 text-muted-foreground">
          Total de páginas - {totalPages}
        </span>
        <Pagination className="w-56 m-0">
          <PaginationContent>
            <PaginationItem>
              <PaginationLink onClick={() => setCurrentPage(1)}>
                <ChevronsLeft strokeWidth={1} />
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              >
                <ChevronLeft strokeWidth={1} />
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>{currentPage}</PaginationItem>
            <PaginationItem>
              <PaginationLink
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
              >
                <ChevronRight strokeWidth={1} />
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink onClick={() => setCurrentPage(totalPages)}>
                <ChevronsRight strokeWidth={1} />
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}

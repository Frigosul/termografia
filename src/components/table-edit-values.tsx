"use client"
import { updateData } from '@/app/http/update-data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination'
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
  TableRow
} from '@/components/ui/table'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, CircleCheck, CircleX, Search } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { TableRowEdit } from './table-row-edit'
dayjs.extend(customParseFormat)

interface TableRow {
  id: string;
  time: string;
  value: number;
  updatedUserAt: string | null;
  updatedAt: string;
}

interface TableProps {
  data: TableRow[];
  instrumentType?: string

}

const searchDataSchema = z.object({
  search: z.string(),
  searchParams: z.string()
})

type SearchData = z.infer<typeof searchDataSchema>

const ITEMS_PER_PAGE = 50

export function TableEditValues({ data, instrumentType }: TableProps) {
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const [editData, setEditData] = useState<TableProps>({ data });
  const [filteredData, setFilteredData] = useState<TableRow[]>(data);
  const [paginatedData, setPaginatedData] = useState<TableRow[]>([]);
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE)


  useEffect(() => {
    setPaginatedData(
      filteredData.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
      )
    );
  }, [filteredData, currentPage]);


  function handleSearchData(searchData: SearchData) {
    const { search, searchParams } = searchData
    const searchDate = dayjs(search, "DD/MM/YYYY - HH:mm", true)
    const searchValue = parseFloat(search)
    const filtered = editData.data.filter((row) => {
      const rowDate = dayjs(row.time)
      const rowValue = row.value

      if (searchDate.isValid()) {
        switch (searchParams) {
          case 'equal':
            return rowDate.isSame(searchDate, 'minute');
          case 'lessOrEqual':
            return rowDate.isBefore(searchDate, 'minute') || rowDate.isSame(searchDate, 'minute');
          case 'greaterOrEqual':
            return rowDate.isAfter(searchDate, 'minute') || rowDate.isSame(searchDate, 'minute');
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

    setFilteredData(filtered)
    setCurrentPage(1)
  }

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


  const [editCell, setEditCell] = useState<{
    rowId: string | null;
    field: keyof TableRow | null;
  }>({
    rowId: null,
    field: null,
  });

  const [inputValue, setInputValue] = useState<string>('')

  function handleDoubleClick(
    rowId: string,
    field: keyof TableRow,
    currentValue: string | number,
  ) {
    setEditCell({ rowId, field });

    const valueAsString = field === 'time'
      ? dayjs(currentValue).format('YYYY-MM-DD HH:mm')
      : currentValue.toString();

    setInputValue(valueAsString);
  }


  function handleSave(rowId: string, field: keyof TableRow) {
    const originalValue = data.find((row) => row.id === rowId);
    const formattedValue = field === 'time' && originalValue
      ? dayjs(originalValue[field]).format('YYYY-MM-DD HH:mm')
      : originalValue?.[field]?.toString() || '';

    if (inputValue !== '' && inputValue !== formattedValue) {
      setEditData((prevData) => {
        const newData = {
          data: prevData?.data.map((item) => {
            if (item.id === rowId) {
              return {
                ...item,
                [field]: field === 'value' ? Number(inputValue) : inputValue,
                updatedUserAt: String(session?.user?.name),
                updatedAt: dayjs().format('YYYY-MM-DDTHH:mm')
              }
            }
            return item
          }) || [],
        }
        setFilteredData(newData.data)
        return newData
      })
    }
    setEditCell({ rowId: null, field: null });
  }

  function handleSaveAndMove(rowId: string, field: keyof TableRow) {
    handleSave(rowId, field);
    const nextRowId = getNextRowId(rowId, 1);

    if (nextRowId !== null) {
      moveToNextCell(nextRowId, field);
    } else {
      const nextField = getNextField(field);
      if (nextField) {
        moveToNextCell(data[0].id, nextField);
      }
    }
  }

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>,
    rowId: string,
    field: keyof TableRow,
  ) {
    if (e.key === 'Enter') {
      handleSaveAndMove(rowId, field);
    }
    if (e.key === 'ArrowDown') {
      const nextRowId = getNextRowId(rowId, 1);
      if (nextRowId !== null) {
        moveToNextCell(nextRowId, field);
      }
    } else if (e.key === 'ArrowUp') {
      const prevRowId = getNextRowId(rowId, -1);
      if (prevRowId !== null) {
        moveToNextCell(prevRowId, field);
      }
    }
  }

  function getNextField(currentField: keyof TableRow): keyof TableRow | null {
    const fields: (keyof TableRow)[] = ['time', 'value'];
    const currentIndex = fields.indexOf(currentField);
    const nextIndex = currentIndex + 1;
    return nextIndex < fields.length ? fields[nextIndex] : null;
  }

  function moveToNextCell(nextRowId: string, field: keyof TableRow) {
    const nextRow = data.find((row) => row.id === nextRowId);
    if (nextRow && nextRow[field]) {
      setEditCell({ rowId: nextRowId, field });

      const valueAsString = field === 'time'
        ? dayjs(nextRow[field]).format('YYYY-MM-DD HH:mm')
        : nextRow[field]?.toString() || '';

      setInputValue(valueAsString);

    }
  }

  function getNextRowId(currentId: string, direction: number): string | null {
    const currentIndex = data.findIndex((row) => row.id === currentId);
    const nextIndex = currentIndex + direction;
    return nextIndex >= 0 && nextIndex < data.length ? data[nextIndex].id : null;
  }

  return (
    <div className="flex-grow flex flex-col max-h-[55vh] max-w-screen-2xl overflow-hidden">
      <div className="flex w-full items-center gap-2 p-1 h-11 border rounded-t-md justify-between">
        <div className="flex border rounded-md">
          <Button
            variant="ghost"
            className="h-8 flex items-center justify-center text-sm"
            disabled={updatedDataMutation.isPending}
            onClick={() => updatedDataMutation.mutateAsync({ dataValue: editData.data })}>
            Salvar
          </Button>
          <Button variant="ghost" className="h-8 flex items-center justify-center text-sm">
            Cancelar
          </Button>
        </div>
        <form
          className="flex items-center justify-center gap-2"
          onSubmit={handleSubmit(handleSearchData)}
        >
          <Controller
            name="searchParams"
            control={control}
            render={({ field: { onChange, value, ref } }) => (
              <Select onValueChange={onChange} value={value}>
                <SelectTrigger
                  ref={ref}
                  className="dark:bg-slate-900 w-48 h-8"
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
            {...register('search')}
            placeholder="Pesquisar"
            className="w-48 h-8"
          />
          <Button
            type='submit'
            className="h-8"
          >
            <Search className='size-5' />
          </Button>
        </form>
      </div>
      <Table className="border-collapse">
        <TableHeader className="bg-card  sticky z-10 top-0 border-b">
          <TableRow>
            <TableHead className="border text-card-foreground w-64 text-center">
              Data - Hora
            </TableHead>
            <TableHead className="border text-card-foreground w-20 text-center">
              {instrumentType === 'press' ? 'Pressão' : 'Temperatura'}
            </TableHead>
            <TableHead className="border text-card-foreground ">
              Status de alteração
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="overflow-y-auto">
          {paginatedData.map((row) => (
            <TableRowEdit
              key={row.id}
              row={row}
              editCell={editCell}
              inputValue={inputValue}
              setInputValue={setInputValue}
              handleDoubleClick={handleDoubleClick}
              handleSave={handleSave}
              handleKeyDown={handleKeyDown}
              instrumentType={instrumentType}
            />
          )
          )}
        </TableBody>
      </Table>
      <div className="text-sm border rounded-b-md flex items-center px-2 justify-between">
        <span className='w-44 text-muted-foreground'>Total de páginas - {totalPages}</span>
        <Pagination className='w-56 m-0'>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink onClick={() => setCurrentPage(1)}>
                <ChevronsLeft strokeWidth={1} />
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                <ChevronLeft strokeWidth={1} />
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              {currentPage}
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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

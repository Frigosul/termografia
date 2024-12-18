import { deleteUnion } from '@/app/http/delete-union'
import { getUnions } from '@/app/http/get-unions'
import { updateUnions } from '@/app/http/update-unions'
import { SkeletonTable } from '@/components/skeleton-table'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useDebounce } from '@/hooks/useDebounce'
import queryClient from '@/lib/react-query'
import { useModalStore } from '@/stores/useModalStore'
import { useMutation, useQuery } from '@tanstack/react-query'
import { CircleCheck, CircleX, Search, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { CreateUnionInstruments } from './create-union-instruments'

interface RowData {
  id: string
  name: string
  fisrtInstrument: string
  secondInstrument: string
  isActive: boolean
}

export function TableManagedUnions() {

  const { data: unions, isError, isLoading, refetch } = useQuery<RowData[]>({
    queryKey: ['list-unions'],
    queryFn: getUnions,
    staleTime: 1000 * 60, // 1 minute
  })
  const [data, setData] = useState<RowData[]>([])
  const [filteredData, setFilteredData] = useState<RowData[]>([]);
  const [search, setSearch] = useState<string>('');
  const { openModal } = useModalStore()


  useEffect(() => {
    if (unions) {
      setData(unions);
      setFilteredData(unions);
    }
  }, [unions]);

  useDebounce(() => {
    setFilteredData(
      data.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
    );
  }, [data, search], 100
  );


  const updatedUnionsMutation = useMutation({
    mutationFn: updateUnions,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['list-unions'] })
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
  const deleteUnionMutation = useMutation({
    mutationFn: deleteUnion,
    onSuccess: async () => {
      await refetch();
      await queryClient.invalidateQueries({ queryKey: ['list-unions'] })
      toast.success('União deletada com sucesso', {
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


  const [editCell, setEditCell] = useState<{
    rowId: string | null;
    field: keyof RowData | null;
  }>({
    rowId: null,
    field: null,
  });

  const [inputValue, setInputValue] = useState<string | number>('')

  function handleDoubleClick(
    rowId: string,
    field: keyof RowData,
    currentValue: string | number,
  ) {

    setEditCell({ rowId, field });
    setInputValue(currentValue.toString());
  }

  function handleSave(rowId: string, field: keyof RowData) {
    const originalValue = data.find((row) => row.id === rowId)?.[field]?.toString() || '';

    if (inputValue !== '' && inputValue !== originalValue) {
      setData((prevData) =>
        prevData.map((item) => {
          if (item.id === rowId) {
            const updatedValue = ['minValue', 'maxValue', 'displayOrder'].includes(field)
              ? Number(inputValue)
              : inputValue;

            return { ...item, [field]: updatedValue };
          }
          return item;
        }
        ),
      );
    }
    setEditCell({ rowId: null, field: null });
  }

  function handleSaveAndMove(rowId: string, field: keyof RowData) {
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
    field: keyof RowData,
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

  function getNextField(currentField: keyof RowData): keyof RowData | null {
    const fields: (keyof RowData)[] = ['name']
    const currentIndex = fields.indexOf(currentField)
    const nextIndex = currentIndex + 1
    return nextIndex < fields.length ? fields[nextIndex] : null
  }

  function moveToNextCell(nextRowId: string, field: keyof RowData) {
    const nextRow = data.find((row) => row.id === nextRowId)
    if (nextRow && nextRow[field] !== undefined) {
      setEditCell({ rowId: nextRowId, field })
      setInputValue(nextRow[field]?.toString() || '')
    }
  }

  function getNextRowId(currentId: string, direction: number): string | null {
    const currentIndex = data.findIndex((row) => row.id === currentId);
    const nextIndex = currentIndex + direction;
    return nextIndex >= 0 && nextIndex < data.length ? data[nextIndex].id : null;
  }
  if (isError) return <p>Erro encontrado, por favor tente novamente.</p>
  if (isLoading) return <SkeletonTable />

  return (
    <div className="flex-grow flex flex-col max-h-[50vh] max-w-screen-2xl overflow-hidden">
      <div className="flex w-full items-center gap-2 p-1 h-11 border rounded-t-md">
        <div className="flex border rounded-md">
          <Button
            variant="ghost"
            className='h-8 flex items-center justify-center text-sm'
            disabled={updatedUnionsMutation.isPending}
            onClick={() => updatedUnionsMutation.mutateAsync({
              unions: data
            })}
          >
            Salvar
          </Button>
          <Button
            variant="ghost"
            className='h-8 flex items-center justify-center text-sm'
            disabled={updatedUnionsMutation.isPending}
          >
            Cancelar
          </Button>
        </div>

        <div className='h-8 flex items-center justify-center px-2 gap-1 w-full max-w-2xl border rounded-md overflow-hidden focus-within:outline-none focus-within:ring-1 hover:border hover:border-primary focus-within:ring-ring '>
          <Search className='size-5 text-muted-foreground' />
          <input
            placeholder="Pesquisar"
            className='w-full h-full text-sm ml-1 bg-transparent placeholder:text-sm focus-visible:outline-none focus-visible:ring-0'
            type="text"
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <Button
          variant="link"
          onClick={() => openModal('create-union-instrument')}
          className='text-sm text-primary ml-auto mr-4'>
          Adicionar união
        </Button>
        <CreateUnionInstruments />
      </div>

      <Table className='border border-collapse'>
        <TableHeader className="bg-card sticky z-10 top-0 ">
          <TableRow>
            <TableHead className="border text-card-foreground  min-w-60 w-32">
              Nome
            </TableHead>
            <TableHead className="border text-card-foreground text-center w-44">
              Instrumento 01
            </TableHead>
            <TableHead className="border text-card-foreground text-center w-44">
              Instrumento 02
            </TableHead>
            <TableHead className="border text-card-foreground text-center w-10">
              Ativo
            </TableHead>
            <TableHead className="border text-card-foreground text-center w-10" />
          </TableRow>
        </TableHeader>
        <TableBody className='overflow-y-auto'>
          {filteredData.map((row) => {
            return (
              <TableRow
                key={row.id}
                className={`odd:bg-white odd:dark:bg-slate-950 even:bg-slate-50 even:dark:bg-slate-900 ${!row.isActive && 'opacity-30'}`}
              >
                <TableCell
                  className="border w-32 p-0 pl-2 h-2"
                  onDoubleClick={() =>
                    handleDoubleClick(row.id, 'name', row.name)
                  }
                >
                  {editCell.rowId === row.id && editCell.field === 'name' ? (
                    <input
                      className="bg-transparent w-full h-full m-0"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onBlur={() => handleSave(row.id, 'name')}
                      onKeyDown={(e) => handleKeyDown(e, row.id, 'name')}
                      autoFocus
                    />
                  ) : (
                    row.name
                  )}
                </TableCell>
                <TableCell
                  className="border text-center w-44 p-0 h-4"

                >{row.fisrtInstrument}
                </TableCell>
                <TableCell
                  className="border text-center w-44 p-0 h-4"

                >
                  {row.secondInstrument}

                </TableCell>
                <TableCell className="border text-center w-10">
                  <Checkbox
                    defaultChecked={row.isActive}
                    className='ml-[-10px]'
                    onCheckedChange={(checked: boolean) => {
                      setData((prevData) =>
                        prevData.map((item) =>
                          item.id === row.id ? { ...item, isActive: checked } : item
                        )
                      );
                    }
                    }
                  />
                </TableCell>
                <TableCell className="border text-center w-10 p-0 m-0">
                  <Button
                    variant="ghost"
                    className='group'
                    onClick={async () => {
                      await deleteUnionMutation.mutateAsync({ unionId: row.id })
                    }}
                  >
                    <Trash2 className='size-5 group-hover:text-red-600 transition-colors' />
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

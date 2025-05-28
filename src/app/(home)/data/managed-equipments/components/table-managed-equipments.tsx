import { Spinner } from '@/app/(home)/components/spinner'
import { getInstruments } from '@/app/http/get-instruments'
import { updateInstruments } from '@/app/http/update-instruments'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
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
import { useMutation, useQuery } from '@tanstack/react-query'
import Fuse from 'fuse.js'
import { CircleCheck, CircleX, EllipsisVertical, Search } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

interface RowData {
  id: string
  idSitrad: number
  name: string
  type: 'temp' | 'press'
  maxValue: number
  minValue: number
  isActive: boolean
  displayOrder: number
}

export function TableManagedEquipments() {
  const {
    data: instruments,
    isLoading,
    isError,
  } = useQuery<RowData[]>({
    queryKey: ['list-instruments'],
    queryFn: getInstruments,
  })
  const [data, setData] = useState<RowData[]>([])
  const [filteredData, setFilteredData] = useState<RowData[]>([])

  useEffect(() => {
    if (instruments) {
      setData(instruments)
      setFilteredData(instruments)
    }
  }, [instruments])

  const [search, setSearch] = useState<string>('')

  const fuse = useMemo(() => {
    return new Fuse(data, {
      keys: ['name'],
      threshold: 0.3,
    })
  }, [data])

  const handleFilter = useCallback(() => {
    if (!search.trim()) {
      setFilteredData(data)
    } else {
      const results = fuse.search(search)
      setFilteredData(results.map((res) => res.item))
    }
  }, [fuse, search, data])

  useDebounce(handleFilter, [handleFilter, fuse], 100)

  const updatedInstrumentsMutation = useMutation({
    mutationFn: updateInstruments,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['list-instruments'] })
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

  const [editCell, setEditCell] = useState<{
    rowId: string | null
    field: keyof RowData | null
  }>({
    rowId: null,
    field: null,
  })

  const [inputValue, setInputValue] = useState<string | number>('')

  function handleDoubleClick(
    rowId: string,
    field: keyof RowData,
    currentValue: string | number,
  ) {
    setEditCell({ rowId, field })
    setInputValue(currentValue.toString())
  }

  function handleSave(rowId: string, field: keyof RowData) {
    const originalValue =
      data.find((row) => row.id === rowId)?.[field]?.toString() || ''

    if (inputValue !== '' && inputValue !== originalValue) {
      setData((prevData) =>
        prevData.map((item) => {
          if (item.id === rowId) {
            const updatedValue = [
              'minValue',
              'maxValue',
              'displayOrder',
            ].includes(field)
              ? Number(inputValue)
              : inputValue

            return { ...item, [field]: updatedValue }
          }
          return item
        }),
      )
    }
    setEditCell({ rowId: null, field: null })
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

  function getNextField(currentField: keyof RowData): keyof RowData | null {
    const fields: (keyof RowData)[] = [
      'name',
      'minValue',
      'maxValue',
      'displayOrder',
    ]
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
    const currentIndex = data.findIndex((row) => row.id === currentId)
    const nextIndex = currentIndex + direction
    return nextIndex >= 0 && nextIndex < data.length ? data[nextIndex].id : null
  }

  if (isError) return <p>Erro encontrado, por favor tente novamente.</p>
  if (isLoading)
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)] max-w-screen-2xl">
        <Spinner size={62} />
      </div>
    )

  return (
    <div className="flex-grow flex flex-col max-h-[40vh] max-w-screen-2xl overflow-hidden">
      <div className="flex w-full items-center gap-2 p-1 h-11 border rounded-t-md">
        <div className="flex border rounded-md">
          <Button
            variant="ghost"
            className="h-8 flex items-center justify-center text-sm"
            disabled={updatedInstrumentsMutation.isPending}
            onClick={() =>
              updatedInstrumentsMutation.mutateAsync({
                instruments: data,
              })
            }
          >
            Salvar
          </Button>
          <Button
            variant="ghost"
            className="h-8 flex items-center justify-center text-sm"
            disabled={updatedInstrumentsMutation.isPending}
          >
            Cancelar
          </Button>
        </div>

        <div className="h-8 flex items-center justify-center px-2 gap-1 w-full max-w-2xl border rounded-md overflow-hidden focus-within:outline-none focus-within:ring-1 hover:border hover:border-primary focus-within:ring-ring ">
          <Search className="size-5 text-muted-foreground" />
          <input
            placeholder="Pesquisar"
            className="w-full h-full text-sm ml-1 bg-transparent placeholder:text-sm focus-visible:outline-none focus-visible:ring-0"
            type="text"
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      <Table className="border border-collapse">
        <TableHeader className="bg-card sticky z-10 top-0 ">
          <TableRow>
            <TableHead className="border text-card-foreground  min-w-60 w-96">
              Nome
            </TableHead>
            <TableHead className="border text-card-foreground text-center w-32">
              Valor Mínimo
            </TableHead>
            <TableHead className="border text-card-foreground text-center w-32">
              Valor Máximo
            </TableHead>
            <TableHead className="border text-card-foreground text-center min-w-40">
              Order de exibição
            </TableHead>
            <TableHead className="border text-card-foreground text-center w-36">
              Tipo
            </TableHead>
            <TableHead className="border text-card-foreground text-center min-w-10">
              Ativo
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="overflow-y-auto">
          {filteredData.map((row) => {
            return (
              <TableRow
                key={row.id}
                className={`odd:bg-white odd:dark:bg-slate-950 even:bg-slate-50 even:dark:bg-slate-900 ${!row.isActive && 'opacity-30'}`}
              >
                <TableCell
                  className="border  min-w-60 p-0 pl-2 h-2"
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
                  className="border text-center w-32 p-0 h-4"
                  onDoubleClick={() =>
                    handleDoubleClick(row.id, 'minValue', row.minValue)
                  }
                >
                  {editCell.rowId === row.id &&
                    editCell.field === 'minValue' ? (
                    <input
                      className="bg-transparent w-full h-full text-center m-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onBlur={() => handleSave(row.id, 'minValue')}
                      onKeyDown={(e) => handleKeyDown(e, row.id, 'minValue')}
                      autoFocus
                    />
                  ) : (
                    row.minValue
                  )}
                </TableCell>
                <TableCell
                  className="border text-center w-32 p-0 h-4"
                  onDoubleClick={() =>
                    handleDoubleClick(row.id, 'maxValue', row.maxValue)
                  }
                >
                  {editCell.rowId === row.id &&
                    editCell.field === 'maxValue' ? (
                    <input
                      className="bg-transparent w-full h-full  text-center m-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onBlur={() => handleSave(row.id, 'maxValue')}
                      onKeyDown={(e) => handleKeyDown(e, row.id, 'maxValue')}
                      autoFocus
                    />
                  ) : (
                    row.maxValue
                  )}
                </TableCell>

                <TableCell
                  className="border text-center w-40 p-0 h-4"
                  onDoubleClick={() =>
                    handleDoubleClick(row.id, 'displayOrder', row.displayOrder)
                  }
                >
                  {editCell.rowId === row.id &&
                    editCell.field === 'displayOrder' ? (
                    <input
                      className="bg-transparent w-full h-full text-center m-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onBlur={() => handleSave(row.id, 'displayOrder')}
                      onKeyDown={(e) =>
                        handleKeyDown(e, row.id, 'displayOrder')
                      }
                      autoFocus
                    />
                  ) : (
                    row.displayOrder
                  )}
                </TableCell>
                <TableCell className="text-center flex justify-between items-center px-4">
                  {row.type}
                  <Popover>
                    <PopoverTrigger>
                      <EllipsisVertical className="size-5" />
                    </PopoverTrigger>
                    <PopoverContent className="flex flex-col gap-4 w-40">
                      <RadioGroup
                        defaultValue={row.type}
                        onValueChange={(value: 'temp' | 'press') => {
                          setData((prevData) =>
                            prevData.map((item) =>
                              item.id === row.id
                                ? { ...item, type: value }
                                : item,
                            ),
                          )
                        }}
                      >
                        <div className="flex items-center">
                          <RadioGroupItem value="temp" id="temp" />
                          <Label
                            htmlFor="temp"
                            className="text-sm ml-2 tracking-wider font-light"
                          >
                            Temperatura
                          </Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value="press" id="press" />
                          <Label
                            htmlFor="press"
                            className="text-sm ml-2 tracking-wider font-light"
                          >
                            Pressão
                          </Label>
                        </div>
                      </RadioGroup>
                    </PopoverContent>
                  </Popover>
                </TableCell>
                <TableCell className="border text-center w-10">
                  <Checkbox
                    defaultChecked={row.isActive}
                    className="ml-[-10px]"
                    onCheckedChange={(checked: boolean) => {
                      setData((prevData) =>
                        prevData.map((item) =>
                          item.id === row.id
                            ? { ...item, isActive: checked }
                            : item,
                        ),
                      )
                    }}
                  />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

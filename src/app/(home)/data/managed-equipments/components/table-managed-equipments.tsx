import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { zodResolver } from '@hookform/resolvers/zod'
import { EllipsisVertical, Save, Search, X } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

interface RowData {
  id: string
  name: string
  type: 'temp' | 'press'
  maxValue: number
  minValue: number
  createdAt: string
  isActive: boolean,
  displayOrder: number,
}
interface TableProps {
  value: RowData[]
}

const searchDataSchema = z.object({
  search: z.string(),
})

type SearchData = z.infer<typeof searchDataSchema>

export function TableManagedEquipments({ value }: TableProps) {
  const [data, setData] = useState<RowData[]>(value)

  const { register, handleSubmit } = useForm<SearchData>({
    resolver: zodResolver(searchDataSchema),
  })

  function handleSearchData(data: SearchData) {
    console.log(data)
  }

  const [editCell, setEditCell] = useState<{
    rowId: string | null;
    field: keyof RowData | null;
  }>({
    rowId: null,
    field: null,
  });

  const [inputValue, setInputValue] = useState<string>('')

  function handleDoubleClick(
    rowId: string,
    field: keyof RowData,
    currentValue: string | number,
  ) {
    setEditCell({ rowId, field });
    setInputValue(currentValue.toString());
  }


  function handleSave(rowId: string, field: keyof RowData) {
    const originalValue = data.find((row) => row.id === rowId)?.[field]?.toString() || ''

    if (inputValue !== '' && inputValue !== originalValue) {
      setData((prevData) =>
        prevData.map((item) =>
          item.id === rowId ? { ...item, [field]: inputValue } : item,
        ),
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
    const fields: (keyof RowData)[] = ['name', 'displayOrder']
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


  return (
    <div className="flex-1 flex flex-col overflow-hidden border border-card-foreground rounded-md">
      {/* div form de busca */}
      <div className="flex justify-between w-full border-b border-card-foreground">
        <div className="flex gap-1">
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
            {...register('search')}
            placeholder="Digite o nome..."
            type="text"
            className="w-22"
          />

          <Button
            variant="default"
            className="flex items-center justify-center rounded-none hover:bg-slate-300"
          >
            <Search />
          </Button>
        </form>
      </div>


      <Table className="border border-collapse">
        <TableHeader className="bg-card sticky z-10 top-0 border-b">
          <TableRow>
            <TableHead className="border text-card-foreground text-center min-w-96">
              Nome
            </TableHead>
            <TableHead className="border text-card-foreground text-center  w-40">
              Tipo
            </TableHead>
            <TableHead className="border text-card-foreground text-center min-w-20">
              Valor Mínimo
            </TableHead>
            <TableHead className="border text-card-foreground text-center min-w-20">
              Valor Máximo
            </TableHead>
            <TableHead className="border text-card-foreground text-center min-w-40">
              Order de exibição
            </TableHead>
            <TableHead className="border text-card-foreground text-center min-w-8">
              Ativo
            </TableHead>

          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => {

            return (
              <TableRow
                key={row.id}
                className={`odd:bg-white odd:dark:bg-slate-950 even:bg-slate-50 even:dark:bg-slate-900 ${!row.isActive && 'opacity-35 '}`}
              >
                <TableCell
                  className="border text-center w-60"
                  onDoubleClick={() =>
                    handleDoubleClick(row.id, 'name', row.name)
                  }
                >
                  {editCell.rowId === row.id && editCell.field === 'name' ? (
                    <input
                      className="bg-transparent"
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
                <TableCell className=" text-center flex justify-between items-center min-w-40 px-4">
                  {row.type}
                  <Popover>
                    <PopoverTrigger>
                      <EllipsisVertical className="size-5" />
                    </PopoverTrigger>
                    <PopoverContent className="flex flex-col gap-4 w-40">
                      <div className="flex items-center">
                        <Checkbox
                          value="temp"
                          defaultChecked={row.type === 'temp'}
                          onCheckedChange={(checked: boolean) => {
                            setData((prevData) =>
                              prevData.map((item) =>
                                item.id === row.id ? { ...item, type: checked ? 'temp' : item.type } : item
                              )
                            );
                          }
                          }
                        />
                        <span className="text-sm ml-2 tracking-wider font-light">
                          Temperatura
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Checkbox
                          value="press"
                          defaultChecked={row.type === 'press'}
                          onCheckedChange={(checked: boolean) => {
                            setData((prevData) =>
                              prevData.map((item) =>
                                item.id === row.id ? { ...item, type: checked ? 'press' : item.type } : item
                              )
                            );
                          }
                          }

                        />
                        <span className="text-sm ml-2 tracking-wider font-light">
                          Pressão
                        </span>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>


                <TableCell
                  className="border text-center w-32"
                  onDoubleClick={() =>
                    handleDoubleClick(row.id, 'minValue', row.minValue)
                  }
                >
                  {editCell.rowId === row.id && editCell.field === 'minValue' ? (
                    <input
                      className="bg-transparent"
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
                  className="border text-center w-32"
                  onDoubleClick={() =>
                    handleDoubleClick(row.id, 'maxValue', row.maxValue)
                  }
                >
                  {editCell.rowId === row.id && editCell.field === 'maxValue' ? (
                    <input
                      className="bg-transparent"
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
                  className="border text-center w-40"
                  onDoubleClick={() =>
                    handleDoubleClick(row.id, 'displayOrder', row.displayOrder)
                  }
                >
                  {editCell.rowId === row.id && editCell.field === 'displayOrder' ? (
                    <input
                      className="bg-transparent [appearance:textfield] w-full text-center [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      type="number"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onBlur={() => handleSave(row.id, 'displayOrder')}
                      onKeyDown={(e) => handleKeyDown(e, row.id, 'displayOrder')}
                    />
                  ) : (
                    row.displayOrder
                  )}
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
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

    </div>
  )
}

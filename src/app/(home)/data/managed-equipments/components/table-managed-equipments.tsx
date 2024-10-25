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
  id: number
  equipment: string
  name: string
  active: boolean
  type: 'temp' | 'press' | 'temp/press'
  displayOrder: number
}

const searchDataSchema = z.object({
  search: z.string(),
})

type SearchData = z.infer<typeof searchDataSchema>

export function TableManagedEquipments() {
  const { register, handleSubmit } = useForm<SearchData>({
    resolver: zodResolver(searchDataSchema),
  })

  function handleSearchData(data: SearchData) {
    console.log(data)
  }

  //dados estão aqui
  const [data, setData] = useState<RowData[]>([
    {
      id: 1,
      equipment: 'Câmara 01',
      name: 'Câmara 01',
      type: 'temp/press',
      active: true,
      displayOrder: 1,
    },
    {
      id: 2,
      equipment: 'Câmara 02',
      name: 'Câmara 02',
      type: 'temp',
      active: true,
      displayOrder: 2,
    },
    {
      id: 3,
      equipment: 'Câmara 03',
      name: 'Câmara 03',
      type: 'temp/press',
      active: true,
      displayOrder: 3,
    },
    {
      id: 4,
      equipment: 'Câmara 04',
      name: 'Câmara 04',
      type: 'temp',
      active: true,
      displayOrder: 4,
    },
    {
      id: 5,
      equipment: 'Câmara 05',
      name: 'Câmara 05',
      type: 'press',
      active: true,
      displayOrder: 5,
    },
    {
      id: 6,
      equipment: 'Câmara 06',
      name: 'Câmara 06',
      type: 'temp',
      active: true,
      displayOrder: 6,
    },
    {
      id: 7,
      equipment: 'Câmara 07',
      name: 'Câmara 07',
      type: 'temp',
      active: true,
      displayOrder: 7,
    },
    {
      id: 8,
      equipment: 'Câmara 08',
      name: 'Câmara 08',
      type: 'temp',
      active: true,
      displayOrder: 8,
    },
    {
      id: 9,
      equipment: 'Câmara 09',
      name: 'Câmara 09',
      type: 'temp',
      active: true,
      displayOrder: 9,
    },
    {
      id: 10,
      equipment: 'Câmara 10',
      name: 'Câmara 10',
      type: 'temp',
      active: true,
      displayOrder: 10,
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
            [field]: field === 'equipment' ? Number(inputValue) : inputValue,
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
    const fields: (keyof RowData)[] = ['equipment', 'name']
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
            <TableHead className="border text-card-foreground  text-center">
              Id
            </TableHead>
            <TableHead className="border text-card-foreground  text-center">
              Equipamento
            </TableHead>
            <TableHead className="border text-card-foreground text-center min-w-60">
              Nome de exibição
            </TableHead>
            <TableHead className="border text-card-foreground text-center min-w-36">
              Tipo
            </TableHead>
            <TableHead className="border text-card-foreground text-center min-w-8">
              Ativo
            </TableHead>
            <TableHead className="border text-card-foreground text-center min-w-40">
              Order de exibição
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => {
            return (
              <TableRow
                key={row.id}
                className="odd:bg-white odd:dark:bg-slate-950 even:bg-slate-50 even:dark:bg-slate-900"
              >
                <TableCell className="border text-center w-24">
                  {row.id}
                </TableCell>
                <TableCell className="border text-center">
                  {row.equipment}
                </TableCell>
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
                <TableCell className=" text-center flex justify-between items-center w-40 px-4">
                  {row.type}
                  <Popover>
                    <PopoverTrigger>
                      <EllipsisVertical className="size-5" />
                    </PopoverTrigger>

                    <PopoverContent className="flex flex-col gap-4 w-40">
                      <div className="flex items-center">
                        <Checkbox value="temp" />
                        <span className="text-sm ml-2 tracking-wider font-light">
                          Temperatura
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Checkbox value="press" />
                        <span className="text-sm ml-2 tracking-wider font-light">
                          Pressão
                        </span>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
                <TableCell className="border text-center min-w-8">
                  <Checkbox defaultChecked={true} className='ml-[-10px]' />
                </TableCell>
                <TableCell
                  className="border text-center w-40 "
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
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

    </div>
  )
}

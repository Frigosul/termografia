import { TableCell, TableRow } from '@/components/ui/table'
import { formattedDateTime } from '@/utils/formatted-datetime'
interface Row {
  id: string
  time: string
  value: number
  updatedUserAt: string | null
  updatedAt: string
}

interface EditCell {
  rowId: string | null
  field: keyof Row | null
}

interface TableRowEditProps {
  row: Row
  editCell: EditCell
  inputValue: string
  setInputValue: (value: string) => void
  handleDoubleClick(
    rowId: string,
    field: keyof Row,
    currentValue: string | number,
  ): void
  handleSave(rowId: string, field: keyof Row): void
  handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>,
    rowId: string,
    field: keyof Row,
  ): void
  instrumentType?: 'press' | 'temp'
}

export const TableRowEdit = ({
  row,
  editCell,
  inputValue,
  setInputValue,
  handleDoubleClick,
  handleSave,
  handleKeyDown,
  instrumentType,
}: TableRowEditProps) => {
  return (
    <TableRow className="odd:bg-white odd:dark:bg-slate-950  even:bg-slate-50 even:dark:bg-slate-900">
      <TableCell className="border text-center">
        {formattedDateTime(row.time)}
      </TableCell>
      <TableCell
        className="border text-center p-0 h-4"
        onDoubleClick={() => handleDoubleClick(row.id, 'value', row.value)}
      >
        {editCell.rowId === row.id && editCell.field === 'value' ? (
          <input
            className="bg-transparent w-full h-full text-center m-0"
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={() => handleSave(row.id, 'value')}
            onFocus={(e) => e.target.select()}
            onKeyDown={(e) => handleKeyDown(e, row.id, 'value')}
            autoFocus
          />
        ) : instrumentType === 'press' ? (
          `${row.value}  bar`
        ) : (
          `${row.value} ºC`
        )}
      </TableCell>
      <TableCell className="border">
        {row.updatedUserAt
          ? instrumentType === 'press'
            ? `Pressão alterada por ${row.updatedUserAt} em ${formattedDateTime(row.updatedAt)}`
            : `Temperatura alterada por ${row.updatedUserAt} em ${formattedDateTime(row.updatedAt)}`
          : instrumentType === 'press'
            ? `Pressão integrada`
            : `Temperatura integrada`}
      </TableCell>
    </TableRow>
  )
}

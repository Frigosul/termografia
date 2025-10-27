/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { TableCell, TableRow } from '@/components/ui/table'
import { convertToLocal } from '@/utils/date-timezone-converter'
import { formattedDateTime } from '@/utils/formatted-datetime'

export interface TableRow {
  id: string
  time: string
  temperature?: number
  pressure?: number
  updatedUserAtTemp?: string | null
  updatedUserAtPress?: string | null
  updatedAtTemp?: string
  updatedAtPress?: string
}

export type EditableField = 'time' | 'temperature' | 'pressure'

interface EditCell {
  rowId: string | null
  field: EditableField | null
}

interface TableRowEditProps {
  row: TableRow
  editCell: EditCell
  inputValue: string
  joinInstruments?: boolean
  setInputValue: (value: string) => void
  handleDoubleClick(rowId: string, field: EditableField, currentValue: string | number): void
  handleSave(rowId: string, field: EditableField, value: string): void
  handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>, rowId: string, field: EditableField): void
  instrumentType?: 'PRESSURE' | 'TEMPERATURE'
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
  joinInstruments,
}: TableRowEditProps) => {
  const isJoined = joinInstruments && row.temperature !== undefined && row.pressure !== undefined


  return (
    <TableRow className="odd:bg-white odd:dark:bg-slate-950 even:bg-slate-50 even:dark:bg-slate-900">

      <TableCell className="border text-center">
        {convertToLocal(row.time).format('DD/MM/YYYY - HH:mm')}
      </TableCell>

      {isJoined ? (
        <>
          {/* Temperatura */}
          <TableCell
            className="border text-center p-0 h-4"
            onDoubleClick={() => handleDoubleClick(row.id, 'temperature', row.temperature ?? 0)}
          >
            {editCell.rowId === row.id && editCell.field === 'temperature' ? (
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onBlur={() => handleSave(row.id, 'temperature', inputValue)}
                onFocus={(e) => e.target.select()}
                onKeyDown={(e) => handleKeyDown(e, row.id, 'temperature')}
                autoFocus
                className="bg-transparent w-full h-full text-center m-0"
              />
            ) : (
              `${row.temperature ?? '-'} ºC`
            )}
          </TableCell>

          {/* Pressão */}
          <TableCell
            className="border text-center p-0 h-4"
            onDoubleClick={() => handleDoubleClick(row.id, 'pressure', row.pressure ?? 0)}
          >
            {editCell.rowId === row.id && editCell.field === 'pressure' ? (
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onBlur={() => handleSave(row.id, 'pressure', inputValue)}
                onFocus={(e) => e.target.select()}
                onKeyDown={(e) => handleKeyDown(e, row.id, 'pressure')}
                autoFocus
                className="bg-transparent w-full h-full text-center m-0"
              />
            ) : (
              `${row.pressure ?? '-'} bar`
            )}
          </TableCell>
        </>
      ) : (
        <TableCell
          className="border text-center p-0 h-4"
          onDoubleClick={() =>
            instrumentType === 'PRESSURE'
              ? handleDoubleClick(row.id, 'pressure', row.pressure ?? 0)
              : handleDoubleClick(row.id, 'temperature', row.temperature ?? 0)
          }
        >
          {editCell.rowId === row.id && (
            instrumentType === 'PRESSURE' && editCell.field === 'pressure' ? (
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onBlur={() => handleSave(row.id, 'pressure', inputValue)}
                onFocus={(e) => e.target.select()}
                onKeyDown={(e) => handleKeyDown(e, row.id, 'pressure')}
                autoFocus
                className="bg-transparent w-full h-full text-center m-0"
              />
            ) : instrumentType === 'TEMPERATURE' && editCell.field === 'temperature' ? (
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onBlur={() => handleSave(row.id, 'temperature', inputValue)}
                onFocus={(e) => e.target.select()}
                onKeyDown={(e) => handleKeyDown(e, row.id, 'temperature')}
                autoFocus
                className="bg-transparent w-full h-full text-center m-0"
              />
            ) : null
          )}

          {!(editCell.rowId === row.id && (editCell.field === 'temperature' || editCell.field === 'pressure')) &&
            (instrumentType === 'PRESSURE'
              ? `${row.pressure ?? '-'} bar`
              : `${row.temperature ?? '-'} ºC`)}
        </TableCell>
      )
      }

      {/* Status de alteração */}
      <TableCell className="border">
        {isJoined ? (
          <>
            {row.updatedUserAtTemp
              ? `Temp alterada por ${row.updatedUserAtTemp} em ${row.updatedAtTemp ? formattedDateTime(row.updatedAtTemp) : '-'
              }`
              : 'Temperatura integrada'}
            <br />
            {row.updatedUserAtPress
              ? `Pressão alterada por ${row.updatedUserAtPress} em ${row.updatedAtPress ? formattedDateTime(row.updatedAtPress) : '-'
              }`
              : 'Pressão integrada'}
          </>
        ) : instrumentType === 'PRESSURE' ? (
          row.updatedUserAtPress
            ? `Pressão alterada por ${row.updatedUserAtPress} em ${row.updatedAtPress ? formattedDateTime(row.updatedAtPress) : '-'}`
            : 'Pressão integrada'
        ) : row.updatedUserAtTemp ? (
          `Temperatura alterada por ${row.updatedUserAtTemp} em ${row.updatedAtTemp ? formattedDateTime(row.updatedAtTemp) : '-'}`
        ) : (
          'Temperatura integrada'
        )}
      </TableCell>
    </TableRow >
  )
}

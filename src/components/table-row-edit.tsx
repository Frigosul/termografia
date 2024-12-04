import { TableCell, TableRow } from "@/components/ui/table";
import { formattedDateTime } from "@/utils/formatted-datetime";


export const TableRowEdit = ({ row, editCell, inputValue, setInputValue, handleDoubleClick, handleSave, handleKeyDown }: any) => {
  return (
    <TableRow
      className="odd:bg-white odd:dark:bg-slate-950  even:bg-slate-50 even:dark:bg-slate-900"
    >
      <TableCell className="border text-center">
        {formattedDateTime(row.time)}
      </TableCell>
      <TableCell
        className="border text-center p-0 h-4"
        onDoubleClick={() => handleDoubleClick(row.id, 'temperature', row.temperature)}
      >
        {editCell.rowId === row.id && editCell.field === 'temperature' ? (
          <input
            className="bg-transparent w-full h-full text-center m-0"
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
      <TableCell className="border">
        {row.updatedUserAt
          ? `Temperatura alterada por ${row.updatedUserAt} em ${formattedDateTime(row.updatedAt)}`
          : `Temperatura integrada`}
      </TableCell>
    </TableRow>
  );
};

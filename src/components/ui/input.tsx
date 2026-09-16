import * as React from 'react'

import { cn } from '@/lib/utils'
import { parseDecimal } from '@/utils/parse-decimal'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  nativeNumber?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, inputMode, nativeNumber, onChange, ...props }, ref) => {
    const isDecimalInput = type === 'number' && !nativeNumber

    return (
      <input
        type={isDecimalInput ? 'text' : type}
        inputMode={isDecimalInput ? 'decimal' : inputMode}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        onChange={(event) => {
          if (isDecimalInput) {
            const value = parseDecimal(event.currentTarget.value)
            const isEmpty = event.currentTarget.value.trim() === ''
            const min = props.min === undefined ? undefined : Number(props.min)
            const max = props.max === undefined ? undefined : Number(props.max)
            const isOutOfRange =
              !Number.isNaN(value) &&
              ((min !== undefined && value < min) ||
                (max !== undefined && value > max))

            event.currentTarget.setCustomValidity(
              !isEmpty && Number.isNaN(value)
                ? 'Insira um número válido.'
                : isOutOfRange
                  ? 'Insira um valor dentro do intervalo permitido.'
                  : '',
            )
          }

          onChange?.(event)
        }}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export { Input }

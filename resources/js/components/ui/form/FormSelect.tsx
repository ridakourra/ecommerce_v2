import { forwardRef, type SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import InputError from '@/components/input-error'

export interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string
    error?: string
    containerClassName?: string
    labelClassName?: string
    options: Array<{
        value: string
        label: string
    }>
    placeholder?: string
    value?: string
    onValueChange?: (value: string) => void
}

const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
    ({ 
        className,
        label,
        error,
        containerClassName,
        labelClassName,
        options,
        placeholder,
        value,
        onValueChange,
        id,
        ...props 
    }, ref) => {
        return (
            <div className={cn('space-y-2', containerClassName)}>
                {label && (
                    <Label 
                        htmlFor={id} 
                        className={cn('block', labelClassName)}
                    >
                        {label}
                    </Label>
                )}
                <Select {...props} value={value} onValueChange={onValueChange}>
                    <SelectTrigger
                        className={cn(
                            error && 'border-destructive focus-visible:ring-destructive/50',
                            className
                        )}
                    >
                        <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                        {options.map((option) => (
                            <SelectItem 
                                key={option.id} 
                                value={option.id}
                            >
                                {option.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <InputError message={error} />
            </div>
        )
    }
)

FormSelect.displayName = 'FormSelect'

export { FormSelect }
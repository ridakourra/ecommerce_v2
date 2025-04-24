import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import InputError from '@/components/input-error'

export interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    containerClassName?: string
    labelClassName?: string
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
    ({ className, label, error, type = 'text', containerClassName, labelClassName, ...props }, ref) => {
        return (
            <div className={cn('space-y-2', containerClassName)}>
                {label && (
                    <Label 
                        htmlFor={props.id} 
                        className={cn('block', labelClassName)}
                    >
                        {label}
                    </Label>
                )}
                <Input
                    type={type}
                    className={cn(
                        error && 'border-destructive focus-visible:ring-destructive/50',
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                <InputError message={error} />
            </div>
        )
    }
)

FormInput.displayName = 'FormInput'

export { FormInput }
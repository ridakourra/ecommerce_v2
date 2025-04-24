import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import InputError from '@/components/input-error'

export interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string
    error?: string
    containerClassName?: string
    labelClassName?: string
}

const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
    ({ 
        className, 
        label, 
        error, 
        containerClassName, 
        labelClassName, 
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
                <Textarea
                    id={id}
                    ref={ref}
                    className={cn(
                        error && 'border-destructive focus-visible:ring-destructive/50',
                        className
                    )}
                    {...props}
                />
                <InputError message={error} />
            </div>
        )
    }
)

FormTextarea.displayName = 'FormTextarea'

export { FormTextarea }
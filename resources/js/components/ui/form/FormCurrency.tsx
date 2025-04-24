import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import InputError from "@/components/input-error"

interface FormCurrencyProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    error?: string;
}

export function FormCurrency({
    label,
    value,
    onChange,
    placeholder,
    error
}: FormCurrencyProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9.]/g, '');
        if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
            onChange(value);
        }
    };

    return (
        <div className="space-y-2">
            {label && <Label>{label}</Label>}
            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                </span>
                <Input
                    type="text"
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="pl-7"
                />
            </div>
            {error && <InputError message={error} />}
        </div>
    );
}
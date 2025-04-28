import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Section for Name and Brand
export default function SectionOne({ filters, setFilters, brands }) {
    return (
        <div className="flex w-full gap-3">
            <Input
                value={filters.name}
                onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                placeholder="Name of product..."
                id="name"
            />

            <Select value={filters.brand} onValueChange={(value) => setFilters({ ...filters, brand: value })}>
                <SelectTrigger>
                    <SelectValue placeholder="Select Brand..." />
                </SelectTrigger>
                <SelectContent>
                    {brands.map((brand, key) => (
                        <SelectItem key={key} value={brand}>
                            {brand}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

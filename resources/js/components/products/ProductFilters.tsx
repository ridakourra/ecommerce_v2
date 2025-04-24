import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Filters {
    creators: Array<{
        id: number;
        first_name: string;
        last_name: string;
    }>;
    categories: Array<{
        id: number;
        name: string;
    }>;
    brands: string[];
    statuses: string[];
}

interface ProductFiltersProps {
    filters: Filters;
    filtersState: {
        search: string;
        creator: string;
        archived: string;
        status: string;
        brand: string;
        category: string;
    };
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFilterChange: (key: string, value: string) => void;
    onResetFilters: () => void;
}

export default function ProductFilters({ filters, filtersState, onFilterChange, onResetFilters }: ProductFiltersProps) {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Input placeholder="Search products..." value={filtersState.search} onChange={(e) => onFilterChange('search', e.target.value)} />

            <Select value={filtersState.creator} onValueChange={(value) => onFilterChange('creator', value)}>
                <SelectTrigger>
                    <SelectValue placeholder="Filter by creator" />
                </SelectTrigger>
                <SelectContent>
                    {filters.creators.map((creator) => (
                        <SelectItem key={creator.id} value={String(creator.id)}>
                            {creator.first_name} {creator.last_name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select value={filtersState.archived} onValueChange={(value) => onFilterChange('archived', value)}>
                <SelectTrigger>
                    <SelectValue placeholder="Filter by archived" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="true">Archived</SelectItem>
                    <SelectItem value="false">Not Archived</SelectItem>
                </SelectContent>
            </Select>

            <Select value={filtersState.status} onValueChange={(value) => onFilterChange('status', value)}>
                <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                    {filters.statuses.map((status) => (
                        <SelectItem key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select value={filtersState.brand} onValueChange={(value) => onFilterChange('brand', value)}>
                <SelectTrigger>
                    <SelectValue placeholder="Filter by brand" />
                </SelectTrigger>
                <SelectContent>
                    {filters.brands.map((brand) => (
                        <SelectItem key={brand} value={brand}>
                            {brand}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select value={filtersState.category} onValueChange={(value) => onFilterChange('category', value)}>
                <SelectTrigger>
                    <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                    {filters.categories.map((category) => (
                        <SelectItem key={category.id} value={String(category.id)}>
                            {category.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <div className="flex justify-start">
                <Button variant="ghost" size="sm" onClick={onResetFilters}>
                    Reset Filters
                </Button>
            </div>
        </div>
    );
}

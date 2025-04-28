import { Input } from '@/components/ui/input';

// Section for Price
export default function SectionTwo({ filters, setFilters }) {
    return (
        <div className="flex w-full gap-3">
            <Input
                id="minPrice"
                placeholder="Min price..."
                value={filters.minPrice}
                type="number"
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
            />
            <Input
                id="maxPrice"
                placeholder="Max price..."
                value={filters.maxPrice}
                type="number"
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
            />
        </div>
    );
}

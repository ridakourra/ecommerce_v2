/**
 * - name product
 * - Categories
 * - Brand
 * - Price [Begin - End]
 *
 */

import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { router } from '@inertiajs/react';
import { Filter, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import SectionOne from './filter/SectionOne';
import SectionThree from './filter/SectionThree';
import SectionTwo from './filter/SectionTwo';

export default function FilterSection({ Filters, brands }) {
    const [filters, setFilters] = useState({
        name: Filters.name || '',
        brand: Filters.brand || '',

        minPrice: Filters.minPrice || '',
        maxPrice: Filters.maxPrice || '',

        departement: Filters.departement || '',
        category: Filters.category || '',
        type: Filters.type || '',
    });

    const submit = (e) => {
        e.preventDefault();
        router.get(route('menu'), filters, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const resetSearch = () => {
        router.get(
            route('menu'),
            {},
            {
                onSuccess: () => {
                    setFilters({
                        name: '',
                        brand: '',

                        minPrice: '',
                        maxPrice: '',

                        departement: '',
                        category: '',
                        type: '',
                    });
                },
                preserveScroll: true,
                preserveState: true,
            }
        );
    };

    return (
        <Collapsible>
            <div className="mb-3 flex w-full justify-between">
                <CollapsibleTrigger asChild>
                    <Button>
                        Filter <Filter />
                    </Button>
                </CollapsibleTrigger>
                <Button onClick={resetSearch} variant="outline">
                    Reset Filter <RefreshCw />
                </Button>
            </div>
            <CollapsibleContent>
                <form onChange={submit} className="space-y-4">
                    {/* Name - Brand */}
                    <SectionOne brands={brands} filters={filters} setFilters={setFilters} />
                    {/* Price */}
                    <SectionTwo filters={filters} setFilters={setFilters} />
                    {/* Categories */}
                    <SectionThree filters={filters} setFilters={setFilters} />

                    {/* <div className="flex w-full justify-end">
                        <Button>
                            Search <Search />
                        </Button>
                    </div> */}
                </form>
            </CollapsibleContent>
        </Collapsible>
    );
}

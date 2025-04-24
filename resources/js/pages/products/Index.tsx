import HeadingSmall from '@/components/heading-small';
import ProductFilters from '@/components/products/ProductFilters';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import DialogDelete from '@/components/ui/dialog/DialogDelete';
import MyBadge from '@/components/ui/MyBadge';
import MyButton from '@/components/ui/MyButton';
import { TdAction, TdActions } from '@/components/ui/table/Table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Product } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Edit, Plus, Trash } from 'lucide-react';
import { useState } from 'react';

interface PaginatedProducts {
    data: Product[];
    from: number;
    to: number;
    total: number;
    prev_page_url: string | null;
    next_page_url: string | null;
}

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

interface Props {
    products: PaginatedProducts;
    filters: Filters;
    search?: string;
    creator?: string;
    archived?: string;
    status?: string;
    brand?: string;
    category?: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: route('products.index'),
    },
];

export default function Index({ products, filters }: Props) {
    const [filtersState, setFiltersState] = useState({
        search: '',
        creator: '',
        archived: '',
        status: '',
        brand: '',
        category: '',
    });

    const handleFilterChange = (key: keyof typeof filtersState, value: string) => {
        const updatedFilters = { ...filtersState, [key]: value };
        setFiltersState(updatedFilters);

        router.get(route('products.index'), updatedFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const resetFilters = () => {
        setFiltersState({
            search: '',
            creator: '',
            archived: '',
            status: '',
            brand: '',
            category: '',
        });

        router.get(
            route('products.index'),
            {},
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />

            <div className="space-y-4 p-4">
                <HeadingSmall title="Products" description="Manage your products here." />

                <div className="space-y-4">
                    <ProductFilters filters={filters} filtersState={filtersState} onFilterChange={handleFilterChange} onResetFilters={resetFilters} />

                    <div className="flex w-full items-center justify-between">
                        <p>Products</p>
                        <MyButton text="New Product" icon={Plus} link={route('products.create')} />
                    </div>

                    <div className="rounded-md border">
                        <table className="w-full rounded-md border p-3">
                            <thead>
                                <tr>
                                    {['Image', 'Name', 'Brand', 'Category', 'Creator', 'Satuts', 'Archived'].map((d, k) => (
                                        <th className="px-4 py-2 text-center text-sm font-medium text-gray-500" key={k}>
                                            {d}
                                        </th>
                                    ))}
                                    <th className="px-4 py-2 text-center text-sm font-medium text-gray-500">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y">
                                {products.data.map((d, k) => (
                                    <tr key={k} className="px-4 py-2 text-sm">
                                        <td className="px-4 py-2 text-center text-sm">
                                            <Avatar>
                                                <AvatarImage src={`/storage/${d.image}`} />
                                            </Avatar>
                                        </td>
                                        <td className="px-4 py-2 text-center text-sm">{d.name}</td>
                                        <td className="px-4 py-2 text-center text-sm">{d.brand}</td>
                                        <td className="px-4 py-2 text-center text-sm">{d.category.name}</td>
                                        <td className="px-4 py-2 text-center text-sm">{d.user.first_name}</td>
                                        <td className="px-4 py-2 text-center text-sm">
                                            <MyBadge status={d.status} />
                                        </td>
                                        <td className="px-4 py-2 text-center text-sm">
                                            {d.archived ? <Badge>True</Badge> : <Badge variant="destructive">False</Badge>}
                                        </td>
                                        <TdActions>
                                            <TdAction type="link" href={route('products.show', d.id)} />
                                            <TdAction color="indigo" type="link" href={route('products.edit', d.id)} color="indigo" icon={<Edit />} />
                                            <TdAction
                                                type="dialog"
                                                dialog={
                                                    <DialogDelete
                                                        title="Delete Product"
                                                        description={`Are you sure you want to delete ${d.name}? This action cannot be undone.`}
                                                        trigger={
                                                            <Button
                                                                size="sm"
                                                                className="text-red-500 hover:text-red-600 hover:dark:bg-gray-800"
                                                                variant="ghost"
                                                            >
                                                                <Trash />
                                                            </Button>
                                                        }
                                                        onDelete={() => {
                                                            router.delete(route('products.destroy', d.id));
                                                        }}
                                                    />
                                                }
                                            />
                                        </TdActions>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                            Showing {products.from} to {products.to} of {products.total} results
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={!products.prev_page_url}
                                onClick={() => router.get(products.prev_page_url || '')}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={!products.next_page_url}
                                onClick={() => router.get(products.next_page_url || '')}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

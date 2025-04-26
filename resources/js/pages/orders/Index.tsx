import HeadingSmall from '@/components/heading-small';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import DialogDelete from '@/components/ui/dialog/DialogDelete';
import { TdAction, TdActions } from '@/components/ui/table/Table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Order } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Eye, Trash } from 'lucide-react';
import { useState } from 'react';
import OrderFilters from './partials/OrderFilters';

interface PaginatedOrders {
    data: Order[];
    from: number;
    to: number;
    total: number;
    prev_page_url: string | null;
    next_page_url: string | null;
}

interface Filters {
    users: Array<{
        id: number;
        first_name: string;
        last_name: string;
    }>;
    statuses: string[];
    payment_statuses: string[];
    payment_methods: string[];
}

interface FiltersState {
    user_id: string;
    status: string;
    payment_status: string;
    payment_method: string;
    archived: string;
    search: string;
}

interface Props {
    orders: PaginatedOrders;
    filters: FiltersState;
    filterOptions: Filters;
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Orders', href: route('orders.index') }];

export default function Index({ orders, filters, filterOptions }: Props) {
    const [filtersState, setFiltersState] = useState<FiltersState>(filters);

    const handleFilterChange = (key: keyof FiltersState, value: string) => {
        const updated = { ...filtersState, [key]: value };
        setFiltersState(updated);
        router.get(route('orders.index'), updated, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const resetFilters = () => {
        const empty: FiltersState = {
            status: '',
            payment_status: '',
            payment_method: '',
            user_id: '',
            archived: '',
            search: '',
        };
        setFiltersState(empty);
        router.get(
            route('orders.index'),
            {},
            {
                preserveScroll: true,
                preserveState: true,
            }
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Orders" />

            <div className="space-y-4 p-4">
                <HeadingSmall title="Orders" description="Manage and track orders." />

                <OrderFilters filters={filterOptions} filtersState={filtersState} onFilterChange={handleFilterChange} onResetFilters={resetFilters} />

                <div className="rounded-md border">
                    <table className="w-full rounded-md border p-3">
                        <thead>
                            <tr>
                                {['User', 'Total Price', 'Status', 'Payment', 'Payment Status', 'Archived', 'Actions'].map((h, i) => (
                                    <th key={i} className="px-4 py-2 text-center text-sm font-medium text-gray-500">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {orders.data.map((order, i) => (
                                <tr key={i}>
                                    <td className="px-4 py-2 text-center text-sm">
                                        <div className="flex flex-col items-center justify-center">
                                            {/* <Avatar>
                                                <img src={`https://ui-avatars.com/api/?name=${order.user.first_name}`} alt="" />
                                            </Avatar> */}
                                            <span>{order.user.first_name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-2 text-center text-sm font-medium">${order.total_price}</td>
                                    <td className="px-4 py-2 text-center text-sm">
                                        <Badge>{order.status}</Badge>
                                    </td>
                                    <td className="px-4 py-2 text-center text-sm">{order.payment_method}</td>
                                    <td className="px-4 py-2 text-center text-sm">
                                        <Badge variant={order.payment_status === 'paid' ? 'default' : 'destructive'}>{order.payment_status}</Badge>
                                    </td>
                                    <td className="px-4 py-2 text-center text-sm">
                                        {order.archived ? <Badge>True</Badge> : <Badge variant="destructive">False</Badge>}
                                    </td>
                                    <TdActions>
                                        <TdAction type="link" icon={<Eye />} href={route('orders.show', order.id)} />
                                        <TdAction
                                            type="dialog"
                                            dialog={
                                                <DialogDelete
                                                    title="Delete Order"
                                                    description="Are you sure you want to delete this order?"
                                                    trigger={
                                                        <Button
                                                            size="sm"
                                                            className="text-red-500 hover:text-red-600 hover:dark:bg-gray-800"
                                                            variant="ghost"
                                                        >
                                                            <Trash />
                                                        </Button>
                                                    }
                                                    onDelete={() => router.delete(route('orders.destroy', order.id))}
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
                        Showing {orders.from} to {orders.to} of {orders.total} results
                    </p>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" disabled={!orders.prev_page_url} onClick={() => router.get(orders.prev_page_url || '')}>
                            Previous
                        </Button>
                        <Button variant="outline" size="sm" disabled={!orders.next_page_url} onClick={() => router.get(orders.next_page_url || '')}>
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

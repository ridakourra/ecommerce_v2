import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import DialogDelete from '@/components/ui/dialog/DialogDelete';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/utils';
import { BreadcrumbItem, Order } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Eye, Trash } from 'lucide-react';
import { useState } from 'react';

interface Props {
    orders: {
        data: Order[];
        from: number;
        to: number;
        total: number;
        prev_page_url: string | null;
        next_page_url: string | null;
    };
    filters: {
        users: Array<{ id: number; first_name: string; last_name: string }>;
        statuses: string[];
        payment_statuses: string[];
    };
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Orders', href: route('orders.index') }];

export default function Index({ orders, filters }: Props) {
    const [selectedFilters, setSelectedFilters] = useState({
        user: '',
        status: '',
        payment_status: '',
        archived: '',
    });

    const handleFilterChange = (key: string, value: string) => {
        const newFilters = { ...selectedFilters, [key]: value };
        setSelectedFilters(newFilters);
        router.get(route('orders.index'), newFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Orders" />
            <div className="space-y-4 p-4">
                <HeadingSmall title="Orders" description="Manage all customer orders." />

                {/* Filters */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Select onValueChange={(value) => handleFilterChange('user', value)} value={selectedFilters.user}>
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by customer" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {filters.users.map((u) => (
                                    <SelectItem key={u.id} value={String(u.id)}>
                                        {`${u.first_name} ${u.last_name}`}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <Select onValueChange={(value) => handleFilterChange('status', value)} value={selectedFilters.status}>
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {filters.statuses.map((s) => (
                                    <SelectItem key={s} value={s}>
                                        {s.charAt(0).toUpperCase() + s.slice(1)}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <Select onValueChange={(value) => handleFilterChange('payment_status', value)} value={selectedFilters.payment_status}>
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by payment status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {filters.payment_statuses.map((p) => (
                                    <SelectItem key={p} value={p}>
                                        {p.charAt(0).toUpperCase() + p.slice(1)}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* Orders Table */}
                <div className="rounded-md border">
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="p-2 text-left text-sm text-gray-500">Customer</th>
                                <th className="p-2 text-left text-sm text-gray-500">Total</th>
                                <th className="p-2 text-left text-sm text-gray-500">Status</th>
                                <th className="p-2 text-left text-sm text-gray-500">Payment</th>
                                <th className="p-2 text-left text-sm text-gray-500">Date</th>
                                <th className="p-2 text-center text-sm text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.data.map((order) => (
                                <tr key={order.id} className="border-t">
                                    <td className="p-2 text-sm">
                                        {order.user.first_name} {order.user.last_name}
                                    </td>
                                    <td className="p-2 text-sm">${order.total_price.toFixed(2)}</td>
                                    <td className="p-2 text-sm capitalize">{order.status}</td>
                                    <td className="p-2 text-sm capitalize">{order.payment_status}</td>
                                    <td className="p-2 text-sm">{formatDate(order.created_at)}</td>
                                    <td className="p-2 text-center text-sm">
                                        <div className="flex justify-center gap-2">
                                            <Button size="sm" variant="outline" onClick={() => router.visit(route('orders.show', order.id))}>
                                                <Eye className="h-4 w-4" />
                                            </Button>

                                            <DialogDelete
                                                title="Delete Order"
                                                description={`Are you sure you want to delete this order?`}
                                                trigger={
                                                    <Button size="sm" variant="destructive">
                                                        <Trash className="h-4 w-4" />
                                                    </Button>
                                                }
                                                onDelete={() => {
                                                    router.delete(route('orders.destroy', order.id));
                                                }}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                    <p>
                        Showing {orders.from} to {orders.to} of {orders.total} results
                    </p>
                    <div className="flex gap-2">
                        <Button size="sm" variant="outline" disabled={!orders.prev_page_url} onClick={() => router.visit(orders.prev_page_url || '')}>
                            Previous
                        </Button>
                        <Button size="sm" variant="outline" disabled={!orders.next_page_url} onClick={() => router.visit(orders.next_page_url || '')}>
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

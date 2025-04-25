import HeadingSmall from '@/components/heading-small';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import DialogDelete from '@/components/ui/dialog/DialogDelete';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { cn, formatDate } from '@/lib/utils';
import { Head, router } from '@inertiajs/react';
import { Archive, Eye, Filter, Inbox, Trash } from 'lucide-react';
import { useState } from 'react';

interface Order {
    id: number;
    user: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
    };
    status: string;
    payment_status: string;
    total_price: number;
    discount: number;
    final_price: number;
    created_at: string;
    items_count: number;
    archived: boolean;
}

interface Props {
    orders: {
        data: Order[];
        meta: {
            total: number;
            from: number | null;
            to: number | null;
            current_page: number;
            last_page: number;
            prev_page_url: string | null;
            next_page_url: string | null;
        };
    };
    filters: {
        users: Array<{ id: number; first_name: string; last_name: string }>;
        statuses: Array<{ value: string; label: string }>;
        payment_statuses: Array<{ value: string; label: string }>;
    };
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Orders', href: route('orders.index') }];

function getStatusColor(status: string) {
    return (
        {
            pending: 'bg-yellow-100 text-yellow-800',
            processing: 'bg-blue-100 text-blue-800',
            completed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
        }[status] || 'bg-gray-100 text-gray-800'
    );
}

function getPaymentStatusColor(status: string) {
    return (
        {
            unpaid: 'bg-red-100 text-red-800',
            paid: 'bg-green-100 text-green-800',
            refunded: 'bg-purple-100 text-purple-800',
        }[status] || 'bg-gray-100 text-gray-800'
    );
}

export default function Index({ orders, filters }: Props) {
    const [selectedFilters, setSelectedFilters] = useState({
        user: '',
        status: '',
        payment_status: '',
        archived: '',
    });

    const handleFilterChange = (key: string, value: string) => {
        const newFilters = {
            ...selectedFilters,
            [key]: value === 'all' ? '' : value,
        };
        setSelectedFilters(newFilters);
        router.get(route('orders.index'), newFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Orders" />
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <HeadingSmall title="Orders" description="Manage all customer orders." />

                    <Button variant="outline" onClick={() => handleFilterChange('archived', selectedFilters.archived ? '' : 'true')}>
                        {selectedFilters.archived ? (
                            <>
                                <Inbox className="mr-2 h-4 w-4" />
                                Show Active
                            </>
                        ) : (
                            <>
                                <Archive className="mr-2 h-4 w-4" />
                                Show Archived
                            </>
                        )}
                    </Button>
                </div>

                <Card>
                    {/* Filters */}
                    <div className="border-b p-4">
                        <div className="text-muted-foreground mb-2 flex items-center text-sm">
                            <Filter className="mr-2 h-4 w-4" />
                            Filters
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <Select onValueChange={(value) => handleFilterChange('user', value)} value={selectedFilters.user}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by customer" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="all">All Customers</SelectItem>
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
                                        <SelectItem value="all">All Statuses</SelectItem>
                                        {filters.statuses.map((status) => (
                                            <SelectItem key={status.value} value={status.value}>
                                                {status.label}
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
                                        <SelectItem value="all">All Payment Statuses</SelectItem>
                                        {filters.payment_statuses.map((status) => (
                                            <SelectItem key={status.value} value={status.value}>
                                                {status.label}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Orders Table */}
                    <div className="min-h-[300px]">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-muted/50 border-b">
                                    <th className="text-muted-foreground p-3 text-left text-sm font-medium">Customer</th>
                                    <th className="text-muted-foreground p-3 text-left text-sm font-medium">Total</th>
                                    <th className="text-muted-foreground p-3 text-left text-sm font-medium">Status</th>
                                    <th className="text-muted-foreground p-3 text-left text-sm font-medium">Payment</th>
                                    <th className="text-muted-foreground p-3 text-left text-sm font-medium">Date</th>
                                    <th className="text-muted-foreground p-3 text-center text-sm font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!orders.data?.length ? (
                                    <tr>
                                        <td colSpan={6} className="text-muted-foreground py-8 text-center">
                                            No orders found
                                        </td>
                                    </tr>
                                ) : (
                                    orders.data.map((order) => (
                                        <tr key={order.id} className="border-b">
                                            <td className="p-3">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">
                                                        {order.user.first_name} {order.user.last_name}
                                                    </span>
                                                    <span className="text-muted-foreground text-sm">Order #{order.id}</span>
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">${order.final_price.toFixed(2)}</span>
                                                    {order.discount > 0 && (
                                                        <span className="text-muted-foreground text-sm">-${order.discount.toFixed(2)} discount</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <Badge className={cn('capitalize', getStatusColor(order.status))}>{order.status}</Badge>
                                            </td>
                                            <td className="p-3">
                                                <Badge className={cn('capitalize', getPaymentStatusColor(order.payment_status))}>
                                                    {order.payment_status}
                                                </Badge>
                                            </td>
                                            <td className="p-3">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{formatDate(order.created_at)}</span>
                                                    <span className="text-muted-foreground text-sm">{formatDate(order.created_at, true)}</span>
                                                </div>
                                            </td>
                                            <td className="p-3 text-center">
                                                <div className="flex justify-center gap-2">
                                                    <Button size="sm" variant="outline" onClick={() => router.visit(route('orders.show', order.id))}>
                                                        <Eye className="h-4 w-4" />
                                                    </Button>

                                                    <DialogDelete
                                                        title="Delete Order"
                                                        description={`Are you sure you want to delete order #${order.id}?`}
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
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {orders.data?.length > 0 && (
                        <div className="flex items-center justify-between border-t p-4">
                            <p className="text-muted-foreground text-sm">
                                Showing {orders.meta.from} to {orders.meta.to} of {orders.meta.total} orders
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={!orders.meta.prev_page_url}
                                    onClick={() => router.visit(orders.meta.prev_page_url || '')}
                                >
                                    Previous
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={!orders.meta.next_page_url}
                                    onClick={() => router.visit(orders.meta.next_page_url || '')}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}

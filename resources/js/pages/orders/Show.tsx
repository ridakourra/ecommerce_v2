import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DialogDelete from '@/components/ui/dialog/DialogDelete';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { BreadcrumbItem, Order } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Archive, ArrowLeft, Calendar, CreditCard, Package, Trash, Truck, User } from 'lucide-react';
import { StatusUpdateDialog } from '@/components/orders/StatusUpdateDialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Props {
    order: Order;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Orders', href: route('orders.index') },
    { title: 'Order Details', href: '#' },
];

export default function Show({ order }: Props) {
    const handleDelete = () => {
        router.delete(route('orders.destroy', order.id));
    };

    const getStatusColor = (status: string) => {
        return {
            'pending': 'bg-yellow-100 text-yellow-800',
            'processing': 'bg-blue-100 text-blue-800',
            'shipped': 'bg-purple-100 text-purple-800',
            'delivered': 'bg-green-100 text-green-800',
            'cancelled': 'bg-red-100 text-red-800',
        }[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Order #${order.id}`} />
            
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Order #{order.id}</h1>
                        <p className="text-muted-foreground mt-1">
                            Placed on {new Date(order.created_at).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => router.get(route('orders.index'))}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Orders
                        </Button>
                        <StatusUpdateDialog orderId={order.id} currentStatus={order.status} />
                        <DialogDelete
                            title="Delete Order"
                            description={`Are you sure you want to delete order #${order.id}?`}
                            trigger={
                                <Button variant="destructive">
                                    <Trash className="mr-2 h-4 w-4" />
                                    Delete Order
                                </Button>
                            }
                            onDelete={handleDelete}
                        />
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Left Column */}
                    <div className="space-y-6">
                        {/* Customer Info */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-base font-semibold">
                                    Customer Information
                                </CardTitle>
                                <User className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="flex items-center space-x-4">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={`https://ui-avatars.com/api/?name=${order.user.first_name}`} />
                                        <AvatarFallback>{order.user.first_name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">{order.user.first_name} {order.user.last_name}</p>
                                        <p className="text-muted-foreground text-sm">{order.user.email}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Order Status */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-base font-semibold">
                                    Order Status
                                </CardTitle>
                                <Package className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Status</span>
                                        <Badge className={cn("capitalize", getStatusColor(order.status))}>
                                            {order.status}
                                        </Badge>
                                    </div>
                                    <Separator />
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Payment Method</span>
                                        <div className="flex items-center gap-2">
                                            <CreditCard className="h-4 w-4" />
                                            {order.payment_method}
                                        </div>
                                    </div>
                                    <Separator />
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Payment Status</span>
                                        <Badge variant={order.payment_status === 'paid' ? 'default' : 'destructive'}>
                                            {order.payment_status}
                                        </Badge>
                                    </div>
                                    <Separator />
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Order Date</span>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Order Summary */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-base font-semibold">
                                    Order Summary
                                </CardTitle>
                                <Truck className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span>${order.total_price}</span>
                                    </div>
                                    {order.discount > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Discount</span>
                                            <span>-${order.discount}</span>
                                        </div>
                                    )}
                                    <Separator />
                                    <div className="flex justify-between font-medium">
                                        <span>Total</span>
                                        <span>${order.final_price}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Archive Status */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-base font-semibold">
                                    Archive Status
                                </CardTitle>
                                <Archive className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Archived</span>
                                    <Badge variant={order.archived ? 'default' : 'secondary'}>
                                        {order.archived ? 'Yes' : 'No'}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Order Items */}
                <Card>
                    <CardHeader>
                        <CardTitle>Order Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <table className="w-full rounded-md border p-3">
                                <thead>
                                    <tr>
                                        {[
                                            'Product',
                                            'Quantity',
                                            'Price',
                                            'Discount',
                                            'Total'
                                        ].map((header, i) => (
                                            <th key={i} className="px-4 py-2 text-center text-sm font-medium text-gray-500">
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {order.items.map((item) => (
                                        <tr key={item.id} className="px-4 py-2 text-sm">
                                            <td className="px-4 py-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border">
                                                        <img
                                                            src={`/storage/${item.product.image}`}
                                                            alt={item.product.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{item.product.name}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            Item #{item.product.id}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-2 text-center">{item.quantity}</td>
                                            <td className="px-4 py-2 text-center">
                                                ${Number(item.price).toFixed(2)}
                                            </td>
                                            <td className="px-4 py-2 text-center">
                                                {item.discount > 0 ? (
                                                    <Badge variant="success" className="bg-green-100 text-green-800">
                                                        -{item.discount}%
                                                    </Badge>
                                                ) : (
                                                    <span className="text-muted-foreground">No discount</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-2 text-center font-medium">
                                                ${(Number(item.price) * (1 - item.discount / 100) * item.quantity).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="border-t">
                                    <tr>
                                        <td colSpan={4} className="px-4 py-2 text-right font-medium">
                                            Subtotal
                                        </td>
                                        <td className="px-4 py-2 text-center font-medium">
                                            ${order.total_price}
                                        </td>
                                    </tr>
                                    {order.discount > 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-2 text-right text-green-600">
                                                Discount
                                            </td>
                                            <td className="px-4 py-2 text-center text-green-600">
                                                -${order.discount}
                                            </td>
                                        </tr>
                                    )}
                                    <tr>
                                        <td colSpan={4} className="px-4 py-2 text-right font-bold">
                                            Total
                                        </td>
                                        <td className="px-4 py-2 text-center font-bold">
                                            ${order.final_price}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

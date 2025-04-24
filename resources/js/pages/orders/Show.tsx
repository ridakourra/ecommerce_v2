import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/utils';
import { BreadcrumbItem, Order } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface Props {
    order: Order;
}

export default function Show({ order }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Orders', href: route('orders.index') }, { title: `Order #${order.id}` }];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Order #${order.id}`} />
            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between">
                    <HeadingSmall title={`Order #${order.id}`} description="Order details and items" />
                    <Button variant="outline" onClick={() => router.visit(route('orders.index'))}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                </div>

                {/* Order Info */}
                <div className="space-y-2 rounded-md border bg-white p-4">
                    <p>
                        <strong>Customer:</strong> {order.user.first_name} {order.user.last_name}
                    </p>
                    <p>
                        <strong>Email:</strong> {order.user.email}
                    </p>
                    <p>
                        <strong>Status:</strong> <span className="capitalize">{order.status}</span>
                    </p>
                    <p>
                        <strong>Payment:</strong> <span className="capitalize">{order.payment_status}</span>
                    </p>
                    <p>
                        <strong>Total:</strong> ${order.total_price.toFixed(2)}
                    </p>
                    <p>
                        <strong>Created:</strong> {formatDate(order.created_at)}
                    </p>
                </div>

                {/* Order Items */}
                <div className="rounded-md border bg-white">
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="p-2 text-left text-sm text-gray-500">Product</th>
                                <th className="p-2 text-left text-sm text-gray-500">Price</th>
                                <th className="p-2 text-left text-sm text-gray-500">Quantity</th>
                                <th className="p-2 text-left text-sm text-gray-500">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items.map((item) => (
                                <tr key={item.id} className="border-t">
                                    <td className="p-2 text-sm">{item.product.name}</td>
                                    <td className="p-2 text-sm">${item.price.toFixed(2)}</td>
                                    <td className="p-2 text-sm">{item.quantity}</td>
                                    <td className="p-2 text-sm">${(item.price * item.quantity).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}

import { Card } from '@/components/ui/card';
import { OrderProvider } from '@/contexts/OrderContext';
import { OrdersTable } from '@/components/orders/OrdersTable';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function AdminOrders({ orders }) {
    return (
        <OrderProvider initialOrders={orders.data}>
            <AppLayout>
                <Head title="Manage Orders" />
                <div className="p-6">
                    <Card>
                        <div className="p-6">
                            <h2 className="text-2xl font-bold tracking-tight">Orders Management</h2>
                            <p className="text-muted-foreground">Manage and track all customer orders</p>
                        </div>
                        <OrdersTable viewType="admin" />
                    </Card>
                </div>
            </AppLayout>
        </OrderProvider>
    );
}
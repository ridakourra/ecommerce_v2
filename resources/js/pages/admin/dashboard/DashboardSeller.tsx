import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { BarChart3, DollarSign, Package, ShoppingCart, TrendingUp } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface DashboardCard {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    description?: string;
}

interface DashboardProps {
    productsCount: number;
    ordersCount: number;
    totalRevenue: number;
    totalSales: number;
    recentOrders: Array<{
        id: number;
        customer: string;
        amount: number;
        status: string;
        date: string;
    }>;
    topProducts: Array<{
        id: number;
        name: string;
        price: number;
        sold: number;
        stock: number;
    }>;
}

export default function DashboardSeller({ productsCount, ordersCount, totalRevenue, totalSales }: DashboardProps) {
    const cards: DashboardCard[] = [
        {
            title: 'Total Revenue',
            value: `$${totalRevenue.toFixed(2)}`,
            icon: <DollarSign className="text-muted-foreground h-8 w-8" />,
            description: 'Total earnings from sales',
        },
        {
            title: 'Products',
            value: productsCount,
            icon: <Package className="text-muted-foreground h-8 w-8" />,
            description: 'Total products listed',
        },
        {
            title: 'Orders',
            value: ordersCount,
            icon: <ShoppingCart className="text-muted-foreground h-8 w-8" />,
            description: 'Total orders received',
        },
        {
            title: 'Total Sales',
            value: totalSales,
            icon: <TrendingUp className="text-muted-foreground h-8 w-8" />,
            description: 'Items sold',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Seller Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Stats Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {cards.map((card, index) => (
                        <Card key={index}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                                {card.icon}
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{card.value}</div>
                                {card.description && <p className="text-muted-foreground text-xs">{card.description}</p>}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Sales Chart & Recent Orders */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Sales Overview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-muted-foreground flex h-[300px] items-center justify-center">
                                <BarChart3 className="h-8 w-8" />
                                <span className="ml-2">Sales chart coming soon</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Recent Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-muted-foreground py-4 text-center">Recent orders will appear here</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Product Stats */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Top Selling Products</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-muted-foreground py-4 text-center">Top selling products will appear here</div>
                        </CardContent>
                    </Card>

                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Low Stock Alert</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-muted-foreground py-4 text-center">Low stock products will appear here</div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

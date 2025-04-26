import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { BarChart3, DollarSign, Package, ShoppingCart, TrendingUp } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, Tr, Td } from '@/components/ui/table/Table';
import Heading from '@/components/heading';

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
    color?: string;
}

interface Order {
    id: number;
    total_price: number;
    payment_status: string;
    created_at: string;
    user: {
        first_name: string;
        last_name: string;
        email: string;
        details?: {
            avatar?: string;
        };
    };
}

interface Product {
    id: number;
    name: string;
    price: number;
    order_items_count: number;
    image?: string;
    stock?: number;
}

interface DashboardProps {
    productsCount: number;
    ordersCount: number;
    totalRevenue: number;
    totalSales: number;
    recentOrders: Order[];
    popularProducts: Product[];
}

export default function DashboardSeller({ 
    productsCount, 
    ordersCount, 
    totalRevenue, 
    totalSales,
    recentOrders,
    popularProducts
}: DashboardProps) {
    const cards: DashboardCard[] = [
        {
            title: 'Total Revenue',
            value: `$${totalRevenue.toFixed(2)}`,
            icon: <DollarSign className="text-green-500 h-8 w-8" />,
            description: 'Total profit from sales',
            color: 'bg-green-50 dark:bg-green-900/20'
        },
        {
            title: 'Products',
            value: productsCount,
            icon: <Package className="text-blue-500 h-8 w-8" />,
            description: 'Total listed products',
            color: 'bg-blue-50 dark:bg-blue-900/20'
        },
        {
            title: 'Orders',
            value: ordersCount,
            icon: <ShoppingCart className="text-purple-500 h-8 w-8" />,
            description: 'Total received orders',
            color: 'bg-purple-50 dark:bg-purple-900/20'
        },
        {
            title: 'Total Sales',
            value: totalSales,
            icon: <TrendingUp className="text-amber-500 h-8 w-8" />,
            description: 'Items sold',
            color: 'bg-amber-50 dark:bg-amber-900/20'
        },
    ];

    console.log(recentOrders)

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        }).format(date);
    };

    const getPaymentStatusClass = (status: string) => {
        switch(status) {
            case 'paid':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
            case 'failed':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
        }
    };

    const getStockStatus = (stock?: number) => {
        if (stock === undefined) return null;
        if (stock <= 0) return { label: 'Out of Stock', class: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' };
        if (stock < 10) return { label: 'Low Stock', class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' };
        return { label: 'In Stock', class: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' };
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Seller Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Statistics Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {cards.map((card, index) => (
                        <Card key={index} className="overflow-hidden">
                            <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-2 ${card.color}`}>
                                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                                {card.icon}
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="text-2xl font-bold">{card.value}</div>
                                {card.description && <p className="text-muted-foreground text-xs mt-1">{card.description}</p>}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Sales Chart and Recent Orders */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                    {/* <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Sales Overview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-muted-foreground flex h-[300px] items-center justify-center border rounded-md bg-gray-50 dark:bg-gray-900/20">
                                <BarChart3 className="h-8 w-8" />
                                <span className="mr-2">Sales chart coming soon</span>
                            </div>
                        </CardContent>
                    </Card> */}

                    <Card className="col-span-12">
                        <CardHeader>
                            <CardTitle>Recent Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {recentOrders && recentOrders.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <Table headers={['Customer', 'Email', 'Amount', 'Status', 'Date']}>
                                        {recentOrders.map((order) => (
                                            <Tr key={order.id}>
                                                <Td>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage
                                                                src={
                                                                    order.user && order.user.details && order.user.details.avatar
                                                                        ? `/storage/${order.user.details.avatar}`
                                                                        : undefined
                                                                }
                                                                alt={
                                                                    order.user
                                                                        ? (order.user.first_name || '') + ' ' + (order.user.last_name || '')
                                                                        : 'User'
                                                                }
                                                            />
                                                            <AvatarFallback>
                                                                {order.user
                                                                    ? ((order.user.first_name?.[0] || '') + (order.user.last_name?.[0] || ''))
                                                                    : ''}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="font-medium">
                                                            {order.user
                                                                ? (order.user.first_name || '') + ' ' + (order.user.last_name || '')
                                                                : 'Unknown'}
                                                        </div>
                                                    </div>
                                                </Td>
                                                <Td className="text-xs text-muted-foreground">
                                                    {order.user && order.user.email ? order.user.email : 'Unknown'}
                                                </Td>
                                                <Td>${Number(order.total_price).toFixed(2)}</Td>
                                                <Td>
                                                    <span className={`px-2 py-1 rounded-full text-xs ${getPaymentStatusClass(order.payment_status)}`}>
                                                        {order.payment_status === 'paid' ? 'Paid' : 
                                                         order.payment_status === 'pending' ? 'Pending' : 'Failed'}
                                                    </span>
                                                </Td>
                                                <Td>{formatDate(order.created_at)}</Td>
                                            </Tr>
                                        ))}
                                    </Table>
                                </div>
                            ) : (
                                <div className="text-muted-foreground py-4 text-center">Recent orders will appear here</div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Product Statistics */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Best Selling Products</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {popularProducts && popularProducts.length > 0 ? (
                                <div className="space-y-4">
                                    {popularProducts.map((product) => (
                                        <div key={product.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center">
                                                    {product.image ? (
                                                        <img src={`/storage/${product.image}`} alt={product.name} className="h-full w-full object-cover rounded-md" />
                                                    ) : (
                                                        <Package className="h-5 w-5 text-gray-500" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-medium">{product.name}</div>
                                                    <div className="text-muted-foreground text-xs">${product.price.toFixed(2)}</div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <div className="text-sm font-medium">
                                                    {product.order_items_count} sales
                                                </div>
                                                {product.stock !== undefined && (
                                                    <div className="text-xs mt-1">
                                                        <span className={`px-2 py-0.5 rounded-full ${getStockStatus(product.stock)?.class}`}>
                                                            {getStockStatus(product.stock)?.label}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-muted-foreground py-4 text-center">Best selling products will appear here</div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Low Stock Alert</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {popularProducts && popularProducts.filter(p => p.stock !== undefined && p.stock < 10).length > 0 ? (
                                <div className="space-y-4">
                                    {popularProducts
                                        .filter(p => p.stock !== undefined && p.stock < 10)
                                        .map((product) => (
                                            <div key={product.id} className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center">
                                                        {product.image ? (
                                                            <img src={`/storage/${product.image}`} alt={product.name} className="h-full w-full object-cover rounded-md" />
                                                        ) : (
                                                            <Package className="h-5 w-5 text-gray-500" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{product.name}</div>
                                                        <div className="text-muted-foreground text-xs">${product.price.toFixed(2)}</div>
                                                    </div>
                                                </div>
                                                <div className="text-sm font-medium text-red-500">
                                                    {product.stock} in stock
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                <div className="text-muted-foreground py-4 text-center">Low stock products will appear here</div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

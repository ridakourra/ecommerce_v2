import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { DollarSign, Grid, Package, ShoppingCart, Users2 } from 'lucide-react';
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

interface RecentOrder {
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

interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    created_at: string;
    details?: {
        avatar?: string;
    };
}

interface PopularProduct {
    id: number;
    name: string;
    price: number;
    order_items_count: number;
    image?: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;
    avatar?: string;
}

interface DashboardProps {
    categoriesCount: number;
    productsCount: number;
    ordersCount: number;
    usersCount: number;
    totalRevenue: number;
    recentOrders: RecentOrder[];
    popularProducts: PopularProduct[];
    latestUsers: User[];
}

export default function DashboardAdmin({ 
    categoriesCount, 
    productsCount, 
    ordersCount, 
    usersCount,
    totalRevenue,
    recentOrders,
    popularProducts,
    latestUsers
}: DashboardProps) {
    const cards: DashboardCard[] = [
        {
            title: 'Revenue',
            value: `${Number(totalRevenue)}`,
            icon: <DollarSign className="text-green-500 h-8 w-8" />,
            description: 'Total Revenue',
            color: 'bg-green-50 dark:bg-green-900/20'
        },
        {
            title: 'Categories',
            value: categoriesCount,
            icon: <Grid className="text-blue-500 h-8 w-8" />,
            description: 'Total Categories in System',
            color: 'bg-blue-50 dark:bg-blue-900/20'
        },
        {
            title: 'Products',
            value: productsCount,
            icon: <Package className="text-purple-500 h-8 w-8" />,
            description: 'Total Available Products',
            color: 'bg-purple-50 dark:bg-purple-900/20'
        },
        {
            title: 'Orders',
            value: ordersCount,
            icon: <ShoppingCart className="text-amber-500 h-8 w-8" />,
            description: 'Total Processed Orders',
            color: 'bg-amber-50 dark:bg-amber-900/20'
        },
        {
            title: 'Users',
            value: usersCount,
            icon: <Users2 className="text-indigo-500 h-8 w-8" />,
            description: 'Registered Users',
            color: 'bg-indigo-50 dark:bg-indigo-900/20'
        },
    ];

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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Statistics Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
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

                {/* Recent Orders and Popular Products Section */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Recent Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {recentOrders && recentOrders.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <Table headers={['Customer', 'Amount', 'Status', 'Date']}>
                                        {recentOrders.map((order) => (
                                            <Tr key={order.id}>
                                                <Td>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage src={order.user.details?.avatar ? `/storage/${order.user.details.avatar}` : undefined} alt={`${order.user.first_name} ${order.user.last_name}`} />
                                                            <AvatarFallback>
                                                                {(order.user.first_name?.charAt(0) || '') + (order.user.last_name?.charAt(0) || '')}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="font-medium">{order.user.first_name} {order.user.last_name}</div>
                                                            <div className="text-muted-foreground text-xs">{order.user.email}</div>
                                                        </div>
                                                    </div>
                                                </Td>
                                                <Td>${Number(order.total_price)}</Td>
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
                                <div className="text-muted-foreground py-4 text-center">No recent orders</div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Popular Products</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {popularProducts && popularProducts.length > 0 ? (
                                <div className="space-y-4">
                                    {popularProducts.map((product) => (
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
                                                    <div className="text-muted-foreground text-xs">${product.price}</div>
                                                </div>
                                            </div>
                                            <div className="text-sm font-medium">
                                                {product.order_items_count} sales
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-muted-foreground py-4 text-center">No popular products</div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Latest Users Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Latest Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {latestUsers && latestUsers.length > 0 ? (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                                {latestUsers.map((user) => (
                                    <div key={user.id} className="flex flex-col items-center p-4 text-center rounded-lg border">
                                        <Avatar className="h-16 w-16 mb-3">
                                            <AvatarImage src={user.details?.avatar ? `/storage/${user.details.avatar}` : undefined} alt={`${user.first_name} ${user.last_name}`} />
                                            <AvatarFallback className="text-lg">
                                                {(user.first_name?.charAt(0) || '') + (user.last_name?.charAt(0) || '')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="font-medium">{user.first_name} {user.last_name}</div>
                                        <div className="text-muted-foreground text-xs mt-1">{user.email}</div>
                                        <div className="text-muted-foreground text-xs mt-2">
                                            Joined {formatDate(user.created_at)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-muted-foreground py-4 text-center">No new users</div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

// ... existing code ...

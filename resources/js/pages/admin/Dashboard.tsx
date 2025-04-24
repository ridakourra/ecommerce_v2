import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Grid, Package, ShoppingCart, Users2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface DashboardCard {
    title: string;
    value: number;
    icon: React.ReactNode;
    description?: string;
}

interface DashboardProps {
    categoriesCount: number;
    productsCount: number;
    ordersCount: number;
    usersCount: number;
}

export default function Dashboard({ categoriesCount, productsCount, ordersCount, usersCount }: DashboardProps) {
    const cards: DashboardCard[] = [
        {
            title: 'Categories',
            value: categoriesCount,
            icon: <Grid className="text-muted-foreground h-8 w-8" />,
            description: 'Total categories in system',
        },
        {
            title: 'Products',
            value: productsCount,
            icon: <Package className="text-muted-foreground h-8 w-8" />,
            description: 'Total products available',
        },
        {
            title: 'Orders',
            value: ordersCount,
            icon: <ShoppingCart className="text-muted-foreground h-8 w-8" />,
            description: 'Total orders processed',
        },
        {
            title: 'Users',
            value: usersCount,
            icon: <Users2 className="text-muted-foreground h-8 w-8" />,
            description: 'Registered users',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
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

                {/* Charts Section */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">{/* Add your chart component here */}</CardContent>
                    </Card>

                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Recent Sales</CardTitle>
                        </CardHeader>
                        <CardContent>{/* Add your recent sales list here */}</CardContent>
                    </Card>
                </div>

                {/* Additional Sections */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Popular Products</CardTitle>
                        </CardHeader>
                        <CardContent>{/* Add your popular products list here */}</CardContent>
                    </Card>

                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Latest Users</CardTitle>
                        </CardHeader>
                        <CardContent>{/* Add your latest users list here */}</CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

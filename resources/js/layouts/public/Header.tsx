import { Button } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, LogInIcon, LogOutIcon, ShoppingBag, User, UserPlus } from 'lucide-react';

export default function Header() {
    const { auth } = usePage().props;

    const navigation = [
        { name: 'Home', href: '/' },
        { name: 'Products', href: route('menu') },
        { name: 'Contact', href: '/contact' },
    ];

    return (
        <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 top-0 z-50 border-b px-6 backdrop-blur">
            <div className="flex h-16 w-full items-center">
                {/* Logo */}
                <div className="mr-4 flex items-center space-x-2">
                    <ShoppingBag className="h-6 w-6" />
                    <span className="text-xl font-bold">Galaxy Market</span>
                </div>

                {/* Navigation */}
                <NavigationMenu className="mx-6 hidden md:flex">
                    <NavigationMenuList>
                        {navigation.map((item) => (
                            <NavigationMenuItem key={item.name}>
                                <Link href={item.href} className={cn(navigationMenuTriggerStyle(), 'cursor-pointer')}>
                                    {item.name}
                                </Link>
                            </NavigationMenuItem>
                        ))}
                    </NavigationMenuList>
                </NavigationMenu>

                {/* Actions */}
                <div className="ml-auto flex items-center space-x-4">
                    {auth.user ? (
                        <>
                            <Button asChild variant="ghost" size="icon" className="relative">
                                <Link href={route('cart.index')}>
                                    <ShoppingBag className="h-5 w-5" />
                                    <span className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px]">
                                        0
                                    </span>
                                </Link>
                            </Button>
                            <Button asChild variant="ghost" size="icon">
                                <Link href={route('public.profile.edit')}>
                                    <User className="h-5 w-5" />
                                </Link>
                            </Button>

                            {['seller', 'admin'].includes(auth.user.role) && (
                                <Button asChild variant="ghost" size="icon">
                                    <Link href={route('dashboard')}>
                                        <LayoutDashboard className="h-5 w-5" />
                                    </Link>
                                </Button>
                            )}
                            <Button asChild variant="ghost" size="icon">
                                <Link href={route('logout')} method="post">
                                    <LogOutIcon className="h-5 w-5" />
                                </Link>
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button asChild variant="ghost" size="icon">
                                <Link href="/login">
                                    <LogInIcon className="h-5 w-5" />
                                </Link>
                            </Button>
                            <Button asChild variant="ghost" size="icon">
                                <Link href="/register">
                                    <UserPlus className="h-5 w-5" />
                                </Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

import { NavigationMenu, NavigationMenuList } from '@/components/ui/navigation-menu';
import { Link, usePage } from '@inertiajs/react';
import { Boxes, Home, LayoutDashboard, LogIn, LogOut, ShoppingBag, ShoppingCart, User, UserPlus } from 'lucide-react';

export default function Header() {
    const { auth, data } = usePage().props;

    const navigation = [
        { name: 'Home', href: '/', icon: Home, role: 'all' },
        { name: 'Products', href: route('menu'), icon: Boxes, role: 'all' },
        { name: 'Profile', href: route('public.profile.edit'), icon: User, role: ['auth'] },
        { name: 'Dashboard', href: route('dashboard'), icon: LayoutDashboard, role: ['seller', 'admin'] },
        { name: 'Cart', href: route('cart.index'), icon: ShoppingCart, role: ['auth'] },
        { name: 'Logout', href: route('logout'), icon: LogOut, role: ['auth'] },
        { name: 'Login', href: route('login'), icon: LogIn, role: ['guest'] },
        { name: 'Register', href: route('register'), icon: UserPlus, role: ['guest'] },
    ];

    const nav = navigation.map((nv, key) => {
        const Icon = nv.icon;

        // roles logic
        if (
            nv.role === 'all' ||
            (nv.role.includes('auth') && auth.user) ||
            (nv.role.includes('guest') && !auth.user) ||
            (auth.user && nv.role.includes(auth.user.role))
        ) {
            return (
                <Link method={nv.name === 'Logout' ? 'post' : 'get'} key={key} href={nv.href} className="relative flex gap-1 hover:text-gray-800">
                    {nv.name === 'Cart' && (
                        <span className="bg-primary text-primary-foreground absolute -top-2 -left-2 flex h-5 w-5 items-center justify-center rounded-full text-[10px]">
                            {data?.countCart}
                        </span>
                    )}
                    <Icon className="h-5 w-5" />
                    <span>{nv.name}</span>
                </Link>
            );
        }

        return null;
    });

    return (
        <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 top-0 z-50 border-b px-6 backdrop-blur">
            <div className="flex h-16 w-full items-center justify-between">
                {/* Logo */}
                <Link href={route('home')}>
                    <div className="mr-4 flex items-center space-x-2">
                        <ShoppingBag className="h-6 w-6" />
                        <span className="text-xl font-bold">Galaxy Market</span>
                    </div>
                </Link>

                {/* Navigation */}
                <NavigationMenu className="mx-6 flex gap-3 md:flex">
                    <NavigationMenuList className="flex gap-5 text-sm">{nav}</NavigationMenuList>
                </NavigationMenu>

                {/* Actions
                <div className="ml-auto flex items-center space-x-4">
                    {auth.user ? (
                        <>
                            <Button asChild variant="ghost" size="icon" className="relative">
                                <Link href={route('cart.index')}>
                                    <ShoppingBag className="h-5 w-5" />
                                    <span className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px]">
                                        {data.countCart}
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
                </div> */}
            </div>
        </header>
    );
}

import { Button } from '@/components/ui/button';
import { Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Boxes, Home, LayoutDashboard, LogIn, LogOut, Menu, ShoppingCart, User, UserPlus } from 'lucide-react';
import { useState } from 'react';

const NavMobile = () => {
    const { auth, data } = usePage().props;
    const [open, setOpen] = useState(false);

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
        if (
            nv.role === 'all' ||
            (nv.role.includes('auth') && auth.user) ||
            (nv.role.includes('guest') && !auth.user) ||
            (auth.user && nv.role.includes(auth.user.role))
        ) {
            return (
                <Link
                    key={key}
                    method={nv.name === 'Logout' ? 'post' : 'get'}
                    href={nv.href}
                    className="relative flex items-center gap-2 rounded p-2 px-4 hover:bg-gray-100"
                    onClick={() => setOpen(false)} // يغلق النافذة بعد الضغط
                >
                    {nv.name === 'Cart' && (
                        <span className="bg-primary text-primary-foreground absolute -top-2 -left-0 flex h-5 w-5 items-center justify-center rounded-full text-[10px]">
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
        <>
            <Button variant="ghost" onClick={() => setOpen(true)} className="md:hidden">
                <Menu />
            </Button>

            {open && (
                <div className="fixed inset-0 z-10 h-screen w-screen bg-gray-900/30">
                    <nav className="h-full w-[250px] bg-white shadow-md">
                        <div className="p-2 text-right">
                            <Button variant="ghost" onClick={() => setOpen(false)}>
                                <ArrowLeft />
                            </Button>
                        </div>
                        <div className="mt-2 flex flex-col gap-2 px-2">{nav}</div>
                    </nav>
                </div>
            )}
        </>
    );
};

export default NavMobile;

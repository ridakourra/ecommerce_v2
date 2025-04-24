import { Link } from '@inertiajs/react';

export default function Footer() {
    return (
        <footer className="bg-background border-t px-4 py-6 md:px-6 lg:px-8">
            <div className="container flex flex-col items-center justify-between md:flex-row">
                <p className="text-muted-foreground text-sm">© 2024 Store. All rights reserved.</p>
                <div className="flex items-center space-x-4">
                    <Link href="#" className="text-muted-foreground hover:text-foreground text-sm">
                        Privacy Policy
                    </Link>
                    <Link href="#" className="text-muted-foreground hover:text-foreground text-sm">
                        Terms of Service
                    </Link>
                </div>
            </div>
        </footer>
    );
}

import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

export default function HerSection() {
    return (
        <section className="relative px-4 py-20 text-center md:px-6 lg:px-8">
            <div className="absolute inset-0 -z-10">
                <img
                    src="https://cdn.nwe.io/files/x/75/64/0dd58da6de1cfb52103d0d67a235.jpg"
                    alt="Hero background"
                    className="h-full w-full object-cover opacity-20"
                />
            </div>
            <div className="container mx-auto max-w-4xl">
                <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                    Welcome to Our Store <span className="text-primary">Galaxy Market</span>
                </h1>
                <p className="text-muted-foreground mb-8 text-lg md:text-xl">
                    Discover amazing products at great prices. Shop with confidence and style.
                </p>
                <div className="flex justify-center gap-4">
                    <Button size="lg" asChild>
                        <Link href="/menu">Shop Now</Link>
                    </Button>
                    {/* <Button size="lg" variant="outline" asChild>
                        <Link href="/categories">Browse Categories</Link>
                    </Button> */}
                </div>
            </div>
        </section>
    );
}

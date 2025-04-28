import Heading from '@/components/heading';
import ProductCard2 from '@/components/products/ProductCard2';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

export default function BestCategories({ bestProducts = [] }) {
    return (
        <section className="py-16">
            <div className="container">
                <div className="mb-10 text-center">
                    <Heading title="Best Products" description="Discover our best items" />
                </div>

                <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                    {bestProducts.map(({ product }) => (
                        <ProductCard2 key={product.id} product={product} />
                    ))}
                </div>

                {/* Add More Products Button */}
                <div className="mt-12 flex justify-center">
                    <Button variant="outline" size="lg" asChild className="group gap-2">
                        <Link href={route('menu')}>
                            View All Products
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}

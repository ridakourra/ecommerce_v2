import Heading from '@/components/heading';
import ProductCard2 from '@/components/products/ProductCard2';
import { Button } from '@/components/ui/button';
import { type Product } from '@/types';
import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

interface ProductsProps {
    products?: Product[];
}

// Add mock data
const mockProducts = [
    {
        id: 1,
        name: 'Nike Air Max 2024',
        brand: 'Nike',
        status: 'active',
        description: 'The latest Nike Air Max features revolutionary cushioning that helps push your limits.',
        image: 'https://sneakernews.com/wp-content/uploads/2023/08/nike-air-max-plus-light-streaks-dz3531-400-6.jpg',
        category_id: '1',
    },
    {
        id: 2,
        name: 'MacBook Pro M3',
        brand: 'Apple',
        status: 'active',
        description: 'Supercharged by the most powerful chips ever in a laptop.',
        image: 'https://assets.superhivemarket.com/store/product/197026/image/e07f43f769cd20abdbf31b12196532a0.png',
        category_id: '2',
    },
    {
        id: 3,
        name: 'PlayStation 5',
        brand: 'Sony',
        status: 'pending',
        description:
            'Experience lightning-fast loading with an ultra-high speed SSD, deeper immersion with haptic feedback. Experience lightning-fast loading with an ultra-high speed SSD, deeper immersion with haptic feedback. Experience lightning-fast loading with an ultra-high speed SSD, deeper immersion with haptic feedback.',
        image: 'https://avatars.mds.yandex.net/get-mpic/4700988/img_id3245325251523386991.png/orig',
        category_id: '3',
    },
    {
        id: 4,
        name: 'iPhone 15 Pro',
        brand: 'Apple',
        status: 'active',
        description: 'The most powerful iPhone ever with revolutionary A17 Pro chip.',
        image: 'https://img.championat.com/s/1350x900/news/big/b/y/iphone-15-pro-podeshevel-v-rossii-na-40-smi_17177600441874150352.jpg',
        category_id: '2',
    },
] as Product[];

export default function Products({ products = mockProducts }: ProductsProps) {
    console.log(products);
    return (
        <section className="py-16">
            <div className="container">
                <div className="mb-10 text-center">
                    <Heading title="Last Products" description="Discover our popular items" />
                </div>

                <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                    {products.map((product) => (
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

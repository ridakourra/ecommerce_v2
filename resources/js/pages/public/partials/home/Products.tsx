import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AddToCart, DestroyCart } from '@/functions/Cart';
import { type Product } from '@/types';
import { Link } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, Eye, Heart, ShoppingCart } from 'lucide-react';

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
                    <h2 className="mb-2 text-3xl font-bold">Last Products</h2>
                    <p className="text-muted-foreground">Discover our popular items</p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {products.map((product) => (
                        <Card key={product.id} className="group relative overflow-hidden transition-all hover:shadow-lg">
                            {/* Product Image */}
                            <div className="relative aspect-square overflow-hidden">
                                <img
                                    src={`/storage/${product.image}`}
                                    alt={product.name}
                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                                {/* <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" /> */}

                                {/* Quick Actions */}
                                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                                    <Button size="icon" variant="secondary">
                                        <Heart className="h-4 w-4" />
                                    </Button>
                                </div>

                                {/* Discount Badge */}
                                {product.discount > 0 && <Badge className="absolute top-4 left-4 bg-red-500">-{product.discount}%</Badge>}
                            </div>

                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <Badge variant="secondary">{product.brand}</Badge>
                                    {/* <MyBadge status={product.status} /> */}
                                </div>
                                <CardTitle className="line-clamp-1">{product.name}</CardTitle>
                            </CardHeader>

                            <CardContent>
                                {/* <p className="text-muted-foreground line-clamp-2 text-sm">{product.description}</p> */}
                                <div className="flex items-center gap-2">
                                    {product.discount > 0 ? (
                                        <>
                                            <span className="text-xl font-bold text-green-600">
                                                ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                                            </span>
                                            <span className="text-muted-foreground line-through">${product.price}</span>
                                        </>
                                    ) : (
                                        <span className="text-xl font-bold">${product.price}</span>
                                    )}
                                </div>
                            </CardContent>

                            <CardFooter className="flex items-center justify-between gap-2">
                                {product.inCart ? (
                                    <>
                                        <Button variant="destructive" onClick={() => DestroyCart(product.id)} className="w-full" size="sm">
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                            In Cart
                                        </Button>
                                    </>
                                ) : (
                                    <Button onClick={() => AddToCart(product.id)} className="w-full" size="sm">
                                        <ShoppingCart className="mr-2 h-4 w-4" />
                                        Add to Cart
                                    </Button>
                                )}
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={route('public.products.show', product.id)}>
                                        <Eye />{' '}
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
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

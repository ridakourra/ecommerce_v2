import { Product } from '@/types';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Eye, ShoppingCart } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';

export default function ProductCard({ product }: { product: Product }) {
    return (
        <Card className="group relative overflow-hidden transition-all hover:shadow-lg">
            {/* Product Image */}
            <div className="relative aspect-square overflow-hidden">
                <img
                    src={`/storage/${product.image}`}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                {/* <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" /> */}

                {/* Quick Actions */}
                {/* <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
            <Button size="icon" variant="secondary">
                <Heart className="h-4 w-4" />
            </Button>
        </div> */}

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
                            <span className="text-xl font-bold text-green-600">${(product.price * (1 - product.discount / 100)).toFixed(2)}</span>
                            <span className="text-muted-foreground line-through">${product.price}</span>
                        </>
                    ) : (
                        <span className="text-xl font-bold">${product.price}</span>
                    )}
                </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between gap-2">
                {product.in_cart ? (
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
                        <Eye />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

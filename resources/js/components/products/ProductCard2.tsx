import { AddToCart, DestroyCart } from '@/functions/Cart';
import { calculateFinalPrice } from '@/functions/product';
import { Link } from '@inertiajs/react';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

export default function ProductCard2({ product }) {
    return (
        <div className="flex w-full flex-col overflow-hidden rounded-2xl border bg-white shadow-md transition hover:scale-[1.02] hover:shadow-lg">
            {/* image */}
            <div className="relative h-48 w-full overflow-hidden rounded-b-none">
                <img src={`/storage/${product.image}`} alt={product.name} className="h-full w-full object-cover" />
                {/* discount badge */}
                {product.discount > 0 && (
                    <Badge variant="destructive" className="absolute top-2 left-2 text-xs">
                        {product.discount}%
                    </Badge>
                )}
            </div>

            {/* content */}
            <div className="flex flex-col gap-2 p-4">
                <Badge className="w-max text-xs" variant="outline">
                    {product.brand}
                </Badge>

                <Link href={route('public.products.show', { product: product.id })}>
                    <h3 className="line-clamp-2 text-base font-semibold text-gray-800">{product.name}</h3>
                </Link>

                {/* price section */}
                <div className="flex items-center gap-2">
                    {product.discount ? (
                        <>
                            <p className="text-lg font-bold text-green-600">{Number(calculateFinalPrice(product.price, product.discount).toFixed(2))}$</p>
                            <p className="text-sm text-gray-400 line-through">{Number(product.price).toFixed(2)}$</p>
                        </>
                    ) : (
                        <p className="text-lg font-bold text-gray-800">{Number(product.price).toFixed(2)}$</p>
                    )}
                </div>
            </div>

            {/* actions */}
            <div className="flex">
                {product.in_cart ? (
                    <Button
                        onClick={() => DestroyCart(product.id)}
                        variant="destructive"
                        className="flex w-full items-center justify-center gap-2 rounded-none rounded-b-2xl"
                    >
                        <ArrowLeft size={18} /> Return
                    </Button>
                ) : (
                    <Button
                        onClick={() => AddToCart(product.id)}
                        className="flex w-full items-center justify-center gap-2 rounded-none rounded-b-2xl"
                    >
                        <ShoppingBag size={18} /> Add to Cart
                    </Button>
                )}
            </div>
        </div>
    );
}

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Layout from '@/layouts/public/Layout';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Minus, Plus, ShoppingCart, Truck } from 'lucide-react';
import { useState } from 'react';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    discount: number;
    image: string;
    brand: string;
    inCart: boolean;
    category: {
        id: number;
        name: string;
    };
}

interface Props {
    product: Product;
    relatedProducts: Product[];
}

export default function Product({ product, relatedProducts }: Props) {
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const discountedPrice = product.discount > 0 ? product.price - (product.price * product.discount) / 100 : product.price;

    const handleAddToCart = async () => {
        setIsLoading(true);
        // Add to cart logic here
        setTimeout(() => setIsLoading(false), 1000);
    };

    return (
        <Layout title={product.name}>
            <div className="container py-8">
                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                        <img src={`/storage/${product.image}`} alt={product.name} className="h-full w-full object-cover" />
                        {product.discount > 0 && <Badge className="absolute top-4 left-4 bg-red-500">-{product.discount}%</Badge>}
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col">
                        <div className="mb-4 flex items-center justify-between">
                            <Badge variant="outline">{product.brand}</Badge>
                            <Badge variant="secondary">{product.category.name}</Badge>
                        </div>

                        <h1 className="mb-4 text-3xl font-bold">{product.name}</h1>

                        <div className="mb-6 flex items-baseline gap-2">
                            <span className="text-3xl font-bold">${discountedPrice.toFixed(2)}</span>
                            {product.discount > 0 && <span className="text-muted-foreground text-lg line-through">${product.price.toFixed(2)}</span>}
                        </div>

                        <p className="text-muted-foreground mb-6">{product.description}</p>

                        <Separator className="mb-6" />

                        {/* Quantity Selector */}
                        <div className="mb-6 flex items-center gap-4">
                            <span className="text-muted-foreground font-medium">Quantity:</span>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-12 text-center font-medium">{quantity}</span>
                                <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mb-6 flex gap-4">
                            <Button className="flex-1" size="lg" onClick={handleAddToCart} disabled={isLoading || product.inCart}>
                                {product.inCart ? (
                                    'In Cart'
                                ) : isLoading ? (
                                    'Adding...'
                                ) : (
                                    <>
                                        <ShoppingCart className="mr-2 h-5 w-5" />
                                        Add to Cart
                                    </>
                                )}
                            </Button>
                            <Button variant="outline" size="lg">
                                <Heart className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Shipping Info */}
                        <Card className="bg-muted/50">
                            <div className="flex items-center gap-4 p-4">
                                <Truck className="h-5 w-5" />
                                <div>
                                    <h3 className="font-medium">Free Shipping</h3>
                                    <p className="text-muted-foreground text-sm">Free shipping on orders over $100</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-16">
                        <h2 className="mb-6 text-2xl font-bold">Related Products</h2>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            <AnimatePresence>
                                {relatedProducts.map((relatedProduct) => (
                                    <motion.div
                                        key={relatedProduct.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Card className="group h-full overflow-hidden">
                                            <div className="aspect-square overflow-hidden">
                                                <img
                                                    src={`/storage/${relatedProduct.image}`}
                                                    alt={relatedProduct.name}
                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                />
                                            </div>
                                            <div className="p-4">
                                                <h3 className="mb-2 font-semibold">{relatedProduct.name}</h3>
                                                <div className="flex items-center justify-between">
                                                    <span className="font-medium">${relatedProduct.price.toFixed(2)}</span>
                                                    <Button size="sm" variant="secondary" asChild>
                                                        <a href={route('products.show', relatedProduct.id)}>View</a>
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}

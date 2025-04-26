import { CreateOrderDialog } from '@/components/orders/CreateOrderDialog';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Layout from '@/layouts/public/Layout';
import { CartSummary } from '@/types';
import { Head } from '@inertiajs/react';
import { Package, Truck } from 'lucide-react';
import { CartItemCard } from './partials/cartItems/CartItem';

export default function CartItems({ cartItems, shippingThreshold = 100, shippingCost = 10 }: Props) {
    const subtotal = cartItems.reduce((total, item) => {
        const itemSubtotal = Number(item.subtotal) || 0;
        return total + itemSubtotal;
    }, 0);

    const shipping = subtotal >= shippingThreshold ? 0 : shippingCost;
    const total = subtotal + shipping;

    const cartSummary: CartSummary = {
        subtotal,
        shipping,
        total,
        payment_method: '',
        shipping_address: '',
    };

    return (
        <Layout title="Shopping Cart">
            <Head title="Shopping Cart" />

            <div className="container py-8">
                <div className="mb-6 flex items-center gap-2">
                    <Package className="h-6 w-6" />
                    <h1 className="text-3xl font-bold">Shopping Cart</h1>
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        {cartItems.length === 0 ? (
                            <Card className="p-8 text-center">
                                <p className="text-muted-foreground">Your cart is empty</p>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {cartItems.map((item) => (
                                    <CartItemCard key={item.id} item={item} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <Card className="p-6">
                            <div className="mb-4 flex items-center gap-2">
                                <Truck className="h-5 w-5" />
                                <h2 className="text-lg font-semibold">Order Summary</h2>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Shipping</span>
                                    {shipping === 0 ? <span className="text-green-600">Free</span> : <span>${shipping.toFixed(2)}</span>}
                                </div>

                                {shipping > 0 && (
                                    <div className="bg-muted rounded-md p-3 text-xs">
                                        Add ${(shippingThreshold - subtotal).toFixed(2)} more to get free shipping
                                    </div>
                                )}

                                <Separator />

                                <div className="flex justify-between font-medium">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>

                                {cartItems.length > 0 && (
                                    <div className="pt-4">
                                        <CreateOrderDialog
                                            cartSummary={cartSummary}
                                            disabled={cartItems.some((item) => item.quantity > item.product.stock)}
                                        />
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

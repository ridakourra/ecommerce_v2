import { CartItem } from '@/components/cart/CartItem';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Layout from '@/layouts/public/Layout';
import { Head } from '@inertiajs/react';
interface CartItem {
    item: {
        id: number;
        product: {
            id: number;
            name: string;
            image: string;
            price: number;
            discount: number;
            stock: number;
        };
        quantity: number;
    };
}
interface Props {
    cartItems: CartItem[];
}

export default function CartItems({ cartItems }: Props) {
    const calculateItemPrice = (price: number, discount: number, quantity: number) => {
        const discountedPrice = price - (price * discount) / 100;
        return discountedPrice * quantity;
    };

    const subtotal = cartItems.reduce((total, item) => {
        return total + calculateItemPrice(item.product.price, item.product.discount, item.quantity);
    }, 0);

    const zero = 0;
    const shipping = 100;
    const total = subtotal + (subtotal >= 100 ? shipping : 0);

    return (
        <Layout title="Cart Items">
            <Head title="Shopping Cart" />

            <div className="container py-8">
                <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="space-y-4">
                            {cartItems.map((item) => (
                                <CartItem key={item.id} item={item} calculateItemPrice={calculateItemPrice} />
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <Card className="p-4">
                            <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span>{subtotal >= 100 ? shipping.toFixed(2) : zero.toFixed(2)}</span>
                                </div>
                                <div className="border-t pt-2">
                                    <div className="flex justify-between font-semibold">
                                        <span>Total</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                            <Button className="mt-4 w-full">Proceed to Checkout</Button>
                        </Card>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

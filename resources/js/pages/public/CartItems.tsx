import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { LessCart, PlusCart } from '@/functions/Cart';
import Layout from '@/layouts/public/Layout';
import { Head } from '@inertiajs/react';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface CartItem {
    id: number;
    product: {
        id: number;
        name: string;
        image: string;
        price: number;
        discount: number;
    };
    quantity: number;
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

    const shipping = 10; // Example shipping cost
    const total = subtotal + shipping;

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
                                <Card key={item.id} className="p-4">
                                    <div className="flex gap-4">
                                        <div className="h-24 w-24 flex-shrink-0">
                                            <img
                                                src={`/storage/${item.product.image}`}
                                                alt={item.product.name}
                                                className="h-full w-full rounded-md object-cover"
                                            />
                                        </div>
                                        <div className="flex flex-1 flex-col">
                                            <div className="flex justify-between">
                                                <h3 className="font-medium">{item.product.name}</h3>
                                                <Button variant="ghost" size="icon" className="text-destructive">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <div className="mt-2 flex items-center gap-4">
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        onClick={() => LessCart(item.id)}
                                                        disabled={!(item.quantity >= 0)}
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </Button>
                                                    <Input type="number" value={item.quantity} className="h-8 w-16 text-center" min={1} />
                                                    <Button
                                                        disabled={!(item.product.stock >= item.quantity)}
                                                        onClick={() => PlusCart(item.id)}
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <div className="ml-auto text-right">
                                                    <p className="font-medium">
                                                        ${calculateItemPrice(item.product.price, item.product.discount, item.quantity).toFixed(2)}
                                                    </p>
                                                    {item.product.discount > 0 && (
                                                        <p className="text-muted-foreground text-sm line-through">
                                                            ${(item.product.price * item.quantity).toFixed(2)}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
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
                                    <span>${shipping.toFixed(2)}</span>
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

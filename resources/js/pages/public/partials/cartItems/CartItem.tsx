import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { LessCart, PlusCart } from '@/functions/Cart';
import { CartItem } from '@/types';
import { router } from '@inertiajs/react';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface CartItemProps {
    item: CartItem;
}

export function CartItemCard({ item }: CartItemProps) {
    if (!item || !item.product) {
        return null;
    }

    const updateQuantity = (newQuantity: number) => {
        if (newQuantity < 1 || newQuantity > (item.product?.stock || 0)) return;

        router.put(
            route('cart.update', item.id),
            {
                quantity: newQuantity,
            },
            {
                preserveScroll: true,
            }
        );
    };

    const removeItem = () => {
        router.delete(route('cart.destroy', item.id), {
            preserveScroll: true,
        });
    };

    const price = Number(item.product.price) || 0;
    const discount = Number(item.product.discount) || 0;
    const quantity = Number(item.quantity) || 0;
    const subtotal = price * (1 - discount / 100) * quantity;

    return (
        <Card className="p-4">
            <div className="flex gap-4">
                <div className="h-24 w-24 flex-shrink-0">
                    <img src={`/storage/${item.product.image}`} alt={item.product.name} className="h-full w-full rounded-md object-cover" />
                </div>
                <div className="flex flex-1 flex-col">
                    <div className="flex justify-between">
                        <div>
                            <h3 className="font-medium">{item.product.name}</h3>
                            {item.product.stock < 5 && <p className="text-xs text-red-500">Only {item.product.stock} left</p>}
                        </div>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={removeItem}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="mt-2 flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => LessCart(item.id)} disabled={quantity <= 1}>
                                <Minus className="h-4 w-4" />
                            </Button>
                            <Input
                                type="number"
                                value={quantity}
                                onChange={(e) => updateQuantity(parseInt(e.target.value) || 1)}
                                className="h-8 w-16 text-center"
                                min={1}
                                max={item.product.stock}
                            />
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => PlusCart(item.id)}
                                disabled={quantity >= item.product.stock}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="ml-auto text-right">
                            <p className="font-medium">${subtotal.toFixed(2)}</p>
                            {discount > 0 && <p className="text-muted-foreground text-sm line-through">${(price * quantity).toFixed(2)}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { DestroyCart, LessCart, PlusCart } from '@/functions/Cart';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface CartItemProps {
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
    calculateItemPrice: (price: number, discount: number, quantity: number) => number;
}

export function CartItem({ item, calculateItemPrice }: CartItemProps) {
    return (
        <Card className="p-4">
            <div className="flex gap-4">
                <div className="h-24 w-24 flex-shrink-0">
                    <img src={`/storage/${item.product.image}`} alt={item.product.name} className="h-full w-full rounded-md object-cover" />
                </div>
                <div className="flex flex-1 flex-col">
                    <div className="flex justify-between">
                        <h3 className="font-medium">{item.product.name}</h3>
                        <Button onClick={() => DestroyCart(item.product.id)} variant="ghost" size="icon" className="text-destructive">
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
                            <Input type="number" value={item.quantity} className="h-8 w-16 text-center" min={1} readOnly />
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
                            <p className="font-medium">${calculateItemPrice(item.product.price, item.product.discount, item.quantity).toFixed(2)}</p>
                            {item.product.discount > 0 && (
                                <p className="text-muted-foreground text-sm line-through">${(item.product.price * item.quantity).toFixed(2)}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}

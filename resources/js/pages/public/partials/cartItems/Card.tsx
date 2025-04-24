import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Minus, Plus, Trash2 } from 'lucide-react';
export default function Card({ product }) {
    return (
        <>
            <Card className="p-4">
                <div className="flex gap-4">
                    <div className="h-24 w-24 flex-shrink-0">
                        <img src={`/storage/${product.image}`} alt={product.name} className="h-full w-full rounded-md object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col">
                        <div className="flex justify-between">
                            <h3 className="font-medium">{product.name}</h3>
                            <Button variant="ghost" size="icon" className="text-destructive">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="mt-2 flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="icon" className="h-8 w-8">
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <Input type="number" value={quantity} className="h-8 w-16 text-center" min={1} />
                                <Button variant="outline" size="icon" className="h-8 w-8">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="ml-auto text-right">
                                <p className="font-medium">${calculateItemPrice(product.price, product.discount, quantity).toFixed(2)}</p>
                                {product.discount > 0 && (
                                    <p className="text-muted-foreground text-sm line-through">${(product.price * quantity).toFixed(2)}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </>
    );
}

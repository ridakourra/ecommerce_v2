import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CartSummary, OrderFormData } from '@/types/order';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';

interface Props {
    cartSummary: CartSummary;
}

export function CreateOrderDialog({ cartSummary }: Props) {
    const [open, setOpen] = useState(false);

    const { data, setData, post, processing, errors } = useForm<OrderFormData>({
        payment_method: '',
        shipping_address: '',
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('orders.store'), {
            onSuccess: () => setOpen(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full">Proceed to Checkout</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create Order</DialogTitle>
                    <DialogDescription>Fill in the details below to complete your order</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Payment Method */}
                    <div className="space-y-2">
                        <Label htmlFor="payment_method">Payment Method</Label>
                        <Select value={data.payment_method} onValueChange={(value) => setData('payment_method', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="cash">Cash on Delivery</SelectItem>
                                <SelectItem value="card">Credit Card</SelectItem>
                                <SelectItem value="paypal">PayPal</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.payment_method && <p className="text-destructive text-sm">{errors.payment_method}</p>}
                    </div>

                    {/* Shipping Address */}
                    <div className="space-y-2">
                        <Label htmlFor="shipping_address">Shipping Address</Label>
                        <Textarea
                            id="shipping_address"
                            value={data.shipping_address}
                            onChange={(e) => setData('shipping_address', e.target.value)}
                            placeholder="Enter your full shipping address"
                            rows={3}
                        />
                        {errors.shipping_address && <p className="text-destructive text-sm">{errors.shipping_address}</p>}
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <Label htmlFor="notes">Order Notes (Optional)</Label>
                        <Textarea
                            id="notes"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            placeholder="Any special instructions for your order"
                            rows={2}
                        />
                        {errors.notes && <p className="text-destructive text-sm">{errors.notes}</p>}
                    </div>

                    {/* Order Summary */}
                    <div className="bg-muted rounded-lg p-4">
                        <h4 className="mb-2 font-medium">Order Summary</h4>
                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>${cartSummary.total_price.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Discount</span>
                                <span>-${cartSummary.discount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between border-t pt-1 font-medium">
                                <span>Total</span>
                                <span>${cartSummary.final_price.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Place Order'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

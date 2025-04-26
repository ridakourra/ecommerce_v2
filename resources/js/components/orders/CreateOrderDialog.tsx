import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CartSummary } from '@/types';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
    cartSummary: CartSummary;
    disabled?: boolean;
}

export function CreateOrderDialog({ cartSummary, disabled }: Props) {
    const [open, setOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        payment_method: '',
        shipping_address: '',
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.payment_method || !data.shipping_address) {
            toast.error('Please fill in all required fields');
            return;
        }

        post(route('orders.store'), {
            onSuccess: () => {
                setOpen(false);
                reset();
                toast.success('Order placed successfully');
            },
            onError: (errors) => {
                toast.error(Object.values(errors).join('\n'));
            },
            preserveScroll: true,
        });
    };

    // Use constants from backend
    const paymentMethods = [
        { value: 'cash', label: 'Cash on Delivery' },
        { value: 'card', label: 'Credit Card' },
        { value: 'paypal', label: 'PayPal' },
    ];

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                setOpen(isOpen);
                if (!isOpen) reset();
            }}
        >
            <DialogTrigger asChild>
                <Button className="w-full" disabled={disabled}>
                    Proceed to Checkout
                </Button>
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
                                {paymentMethods.map((method) => (
                                    <SelectItem key={method.value} value={method.value}>
                                        {method.label}
                                    </SelectItem>
                                ))}
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
                    </div>

                    {/* Order Summary */}
                    <div className="bg-muted rounded-lg p-4">
                        <h4 className="mb-2 font-medium">Order Summary</h4>
                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>${cartSummary.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                {cartSummary.shipping === 0 ? (
                                    <span className="text-green-600">Free</span>
                                ) : (
                                    <span>${cartSummary.shipping.toFixed(2)}</span>
                                )}
                            </div>
                            <div className="flex justify-between border-t pt-1 font-medium">
                                <span>Total</span>
                                <span>${cartSummary.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setOpen(false);
                                reset();
                            }}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing || !data.payment_method || !data.shipping_address}>
                            {processing ? (
                                <>
                                    {/* <Loader2 className="mr-2 h-4 w-4 animate-spin" /> */}
                                    Processing...
                                </>
                            ) : (
                                'Place Order'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

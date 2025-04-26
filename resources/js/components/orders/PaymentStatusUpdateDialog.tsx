import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { router } from "@inertiajs/react";
import { useState } from "react";

interface Props {
    orderId: number;
    currentPaymentStatus: string;
}

const paymentStatusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'paid', label: 'Paid' },
    { value: 'failed', label: 'Failed' },
    { value: 'refunded', label: 'Refunded' },
];

export function PaymentStatusUpdateDialog({ orderId, currentPaymentStatus }: Props) {
    const [open, setOpen] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState(currentPaymentStatus);

    const handleUpdate = () => {
        router.put(route('orders.updatePaymentStatus'), { 
            order_id: orderId,
            payment_status: paymentStatus 
        }, {
            preserveScroll: true,
            onSuccess: () => setOpen(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Update Payment Status</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Payment Status</DialogTitle>
                    <DialogDescription>
                        Change the payment status for order #{orderId}
                    </DialogDescription>
                </DialogHeader>

                <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select payment status" />
                    </SelectTrigger>
                    <SelectContent>
                        {paymentStatusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleUpdate}>
                        Update Payment Status
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
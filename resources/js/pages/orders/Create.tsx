import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Product, User } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

interface Props {
    users: User[];
    products: Product[];
}

interface OrderItem {
    product_id: number;
    quantity: number;
}

export default function Create({ users, products }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Orders', href: route('orders.index') }, { title: 'New Order' }];

    const [userId, setUserId] = useState('');
    const [items, setItems] = useState<OrderItem[]>([]);
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    const addItem = () => {
        setItems([...items, { product_id: products[0].id, quantity: 1 }]);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const updateItem = (index: number, key: keyof OrderItem, value: any) => {
        const updated = [...items];
        updated[index][key] = key === 'quantity' ? parseInt(value) : parseInt(value);
        setItems(updated);
    };

    const total = items.reduce((sum, item) => {
        const product = products.find((p) => p.id === item.product_id);
        return sum + (product ? product.price * item.quantity : 0);
    }, 0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        router.post(
            route('orders.store'),
            {
                user_id: parseInt(userId),
                items,
            },
            {
                onError: setErrors,
            }
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Order" />

            <div className="space-y-4 p-4">
                <HeadingSmall title="Create Order" description="Fill the order details below." />

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Customer</label>
                        <Select value={userId} onValueChange={setUserId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select customer" />
                            </SelectTrigger>
                            <SelectContent>
                                {users.map((user) => (
                                    <SelectItem key={user.id} value={String(user.id)}>
                                        {user.first_name} {user.last_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.user_id && <p className="text-sm text-red-500">{errors.user_id[0]}</p>}
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">Items</p>
                            <Button type="button" onClick={addItem}>
                                Add Item
                            </Button>
                        </div>

                        {items.map((item, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <select
                                    value={item.product_id}
                                    onChange={(e) => updateItem(index, 'product_id', e.target.value)}
                                    className="rounded border p-2"
                                >
                                    {products.map((product) => (
                                        <option key={product.id} value={product.id}>
                                            {product.name}
                                        </option>
                                    ))}
                                </select>

                                <Input
                                    type="number"
                                    min={1}
                                    value={item.quantity}
                                    onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                                    className="w-20"
                                />

                                <Button type="button" variant="destructive" onClick={() => removeItem(index)}>
                                    Remove
                                </Button>
                            </div>
                        ))}
                        {errors['items.0.product_id'] && <p className="text-sm text-red-500">{errors['items.0.product_id'][0]}</p>}
                    </div>

                    <div>
                        <p>
                            <strong>Total: </strong>${total.toFixed(2)}
                        </p>
                    </div>

                    <Button type="submit">Create Order</Button>
                </form>
            </div>
        </AppLayout>
    );
}

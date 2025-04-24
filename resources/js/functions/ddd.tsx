import { router } from '@inertiajs/react';

function AddToCart(id: number) {
    router.post(
        route('cart.add'),
        { product_id: id, quantity: 1 },
        {
            preserveScroll: true,
        }
    );
}

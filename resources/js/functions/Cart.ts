import { router } from "@inertiajs/react";

export function AddToCart(productId: number): Promise<void> {
    return new Promise((resolve, reject) => {
        router.post(route('cart.add'), {
            product_id: productId,
            quantity: 1
        }, {
            preserveScroll: true,
            onSuccess: () => resolve(),
            onError: () => reject(),
        });
    });
}

export function PlusCart(cartItem: number): Promise<void> {
    return new Promise((resolve, reject) => {
        router.post(route('cart.cartPlus', cartItem), {}, {
            preserveScroll: true,
            onSuccess: () => resolve(),
            onError: () => reject(),
        });
    });
}

export function LessCart(cartItem: number): Promise<void> {
    return new Promise((resolve, reject) => {
        router.post(route('cart.cartLess', cartItem), {}, {
            preserveScroll: true,
            onSuccess: () => resolve(),
            onError: () => reject(),
        });
    });
}
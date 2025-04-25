export interface OrderFormData {
    payment_method: string;
    shipping_address: string;
    notes: string;
}

export interface CartSummary {
    total_price: number;
    discount: number;
    final_price: number;
}
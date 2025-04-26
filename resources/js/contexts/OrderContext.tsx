import { createContext, useContext, ReactNode } from 'react';

interface Order {
    id: number;
    user: {
        id: number;
        first_name: string;
        last_name: string;
    };
    status: string;
    payment_status: string;
    payment_method: string;
    total_price: number;
    discount: number;
    final_price: number;
    created_at: string;
}

interface OrderContextType {
    orders: Order[];
    updateOrderStatus: (orderId: number, status: string) => void;
    deleteOrder: (orderId: number) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children, initialOrders }: { children: ReactNode; initialOrders: Order[] }) {
    const updateOrderStatus = (orderId: number, status: string) => {
        router.put(route('orders.update', orderId), { status });
    };

    const deleteOrder = (orderId: number) => {
        router.delete(route('orders.destroy', orderId));
    };

    return (
        <OrderContext.Provider value={{ orders: initialOrders, updateOrderStatus, deleteOrder }}>
            {children}
        </OrderContext.Provider>
    );
}

export function useOrders() {
    const context = useContext(OrderContext);
    if (context === undefined) {
        throw new Error('useOrders must be used within an OrderProvider');
    }
    return context;
}
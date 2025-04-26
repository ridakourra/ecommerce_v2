import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    role?: string
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}
export interface UserDetails{
    id: number;
    country: string;
    city: string;
    phone: string;
    address: string;
    date_birth: string;
    avatar: string
}



export interface Size{
    id: number;
    name: string;
    unit: string;
    category_id: string;
}

export interface Category {
    id: number;
    name: string;
    description: string;
    flag: File;
    parent_id: BigInteger;
    parent?: {
        id: number;
        name: string;
        description: string;
        flag: File;
        parent_id: BigInteger;
        parent?: {
            id: number;
            name: string;
            description: string;
            flag: File;
            parent_id: BigInteger;
        };
    };
}


export interface Color{
    id: number;
    name: string;
    code: string;
}


export interface Brand {
    id: number;
    name: string;
    logo: string;
}


export interface Product {
    id: number;
    name: string;
    description: string;
    status: string;
    archived: boolean;
    type: string;
    brand_id: number;
    category_id: number;
    user_id: number;
    user: User;
    category: Category;
    brand: Brand;
    
}


interface CartItem {
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
    subtotal: number;
}

interface CartSummary {
    subtotal: number;
    shipping: number;
    total: number;
    payment_method: string;
    shipping_address: string;
    notes?: string;
}


export interface OrderFormData {
    payment_method: string;
    shipping_address: string;
    notes?: string;
}

export interface CartItem {
    id: number;
    quantity: number;
    subtotal: number;
    product: {
        id: number;
        name: string;
        image: string;
        price: number;
        stock: number;
        discount: number;
    };
}
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(date: string, showTime = false) {
    const d = new Date(date);
    if (showTime) {
        return d.toLocaleTimeString();
    }
    return d.toLocaleDateString();
}
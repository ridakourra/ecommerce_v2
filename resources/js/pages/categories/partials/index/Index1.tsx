import { Link } from '@inertiajs/react';
import ActionsTableCategory from '../ActionsTableCategory';
import Create from '../Create';

interface Category {
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

export default function Index1({ categories }: { categories: Category[] }) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p>All Categories</p>
                <Create />
            </div>

            <div className="space-y-3">
                {categories.map((category) => (
                    <div
                        key={category.id}
                        className="flex items-center justify-between rounded-sm p-2 shadow-sm ring-1 shadow-gray-800 ring-gray-300 hover:bg-[var(--sidebar)] dark:ring-gray-700"
                    >
                        <div>
                            <Link href={route('categories.index', category.id)}>{category.name}</Link>
                        </div>

                        <ActionsTableCategory category={category} />
                    </div>
                ))}
            </div>
        </div>
    );
}

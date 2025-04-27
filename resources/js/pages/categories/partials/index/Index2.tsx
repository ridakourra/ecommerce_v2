import { Link } from '@inertiajs/react';
import ActionsTableCategory from '../ActionsTableCategory';
import Create from '../Create';

interface Category {
    id: number;
    name: string;
    description: string;
    flag: File;
    parent_id: BigInteger;
    parent: {
        id: number;
    };
}

export default function Index2({ categories }: { categories: Category[] }) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-lg font-medium">All Categories</p>
                <Create />
            </div>
            <div className="rounded-md border shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y bg-white">
                        {categories.map((category) => (
                            <tr key={category.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm font-medium">
                                    <Link href={route('categories.index', category.id)} className="text-blue-600 hover:text-blue-800">
                                        {category.name}
                                    </Link>
                                </td>
                                <td className="px-4 py-3 text-sm flex justify-end">
                                    <ActionsTableCategory category={category} />
                                </td>
                            </tr>
                        ))}
                        {categories.length === 0 && (
                            <tr>
                                <td colSpan={2} className="px-4 py-4 text-center text-sm text-gray-500">
                                    No categories found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

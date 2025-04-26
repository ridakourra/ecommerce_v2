import HeadingSmall from '@/components/heading-small';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import MyBadge from '@/components/ui/MyBadge';
import MyButton from '@/components/ui/MyButton';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Check, Edit } from 'lucide-react';

interface Props {
    product: {
        id: number;
        name: string;
        brand: string;
        image: string;
        description: string;
        status: 'pending' | 'approved' | 'rejected' | 'inactive' | 'active';
        archived: boolean;
        category: {
            id: number;
            name: string;
            parent: {
                id: number;
                name: string;
                parent: {
                    id: number;
                    name: string;
                };
            };
        };
        user: {
            id: number;
            first_name: string;
            last_name: string;
            email: string;
        };
        created_at: string;
        updated_at: string;
    };
}

export default function Show({ product }: Props) {
    const { auth } = usePage().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Products',
            href: route('products.index'),
        },
        {
            title: product.name,
            href: route('products.show', product.id),
        },
    ];

    const approvedProduct = (id) => {
        router.post(
            route('products.update.approved', id),
            {},
            {
                preserveScroll: true,
            }
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={product.name} />

            <div className="space-y-6 p-5">
                <div className="flex items-center justify-between">
                    <HeadingSmall title={product.name} description="View product details" />
                    <div className="flex items-center gap-2">
                        {auth.user.role === 'admin' && product.status !== 'approved' && (
                            <MyButton text="Approved" icon={Check} onClick={() => approvedProduct(product.id)} />
                        )}
                        <MyButton text="Edit" icon={Edit} link={route('products.edit', product.id)} />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Image and Basic Info */}
                    <div className="space-y-4 rounded-lg border p-4">
                        <div className="aspect-square overflow-hidden rounded-lg">
                            <img src={`/storage/${product.image}`} alt={product.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                                <MyBadge status={product.status} />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Brand</h3>
                                <p className="text-sm">{product.brand}</p>
                            </div>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-6 rounded-lg border p-4">
                        <div>
                            <h3 className="font-medium">Category Hierarchy</h3>
                            <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                                {product.category.parent.parent.name} {' > '}
                                {product.category.parent.name} {' > '}
                                {product.category.name}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-medium">Description</h3>
                            <p className="mt-2 text-sm text-gray-600">{product.description || 'No description provided'}</p>
                        </div>

                        <div>
                            <h3 className="font-medium">Stock</h3>
                            <p className="mt-2 text-sm text-gray-600">{product.stock || 'No Stock provided'}</p>
                        </div>

                        <div>
                            <h3 className="font-medium">Price</h3>
                            <p className="mt-2 text-sm text-gray-600">{product.price + ' $' || 'No price provided'}</p>
                        </div>

                        <div>
                            <h3 className="font-medium">Discount</h3>
                            <p className="mt-2 text-sm text-gray-600">{product.discount ? product.discount + ' %' : '0'}</p>
                        </div>

                        <div>
                            <h3 className="font-medium">Created By</h3>
                            <div className="mt-2 flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={`https://ui-avatars.com/api/?name=${product.user.first_name}+${product.user.last_name}`} />
                                </Avatar>
                                <div className="text-sm">
                                    <p>
                                        {product.user.first_name} {product.user.last_name}
                                    </p>
                                    <p className="text-gray-500">{product.user.email}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Created At</h3>
                                <p className="text-sm">{new Date(product.created_at).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                                <p className="text-sm">{new Date(product.updated_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

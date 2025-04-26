import HeadingSmall from '@/components/heading-small';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import Index1 from './partials/index/Index1';
import Index2 from './partials/index/Index2';
import Index3 from './partials/index/Index3';

interface Category {
    id: number;
    name: string;
    description: string;
    flag: File;
    parent_id: BigInteger;
    parent?: {
        id: number;
        name: string;
        parent?: {
            id: number;
            name: string;
        };
    };
}

export default function Index({ categories, index }: { categories: Category[]; index: number }) {
    const getBreadcrumbs = (index: number, categories: Category[]): BreadcrumbItem[] => {
        const baseBreadcrumb = {
            title: 'Categories',
            href: '/admin/categories',
        };

        const breadcrumbLevels = {
            1: [baseBreadcrumb],
            2: [
                baseBreadcrumb,
                {
                    title: categories[0]?.parent?.name || 'Category',
                    href: `/admin/categories/${categories[0]?.parent?.id}`,
                },
            ],
            3: [
                baseBreadcrumb,
                {
                    title: categories[0]?.parent?.parent?.name || 'Category',
                    href: `/admin/categories/${categories[0]?.parent?.parent?.id}`,
                },
                {
                    title: categories[0]?.parent?.name || 'Category',
                    href: `/admin/categories/${categories[0]?.parent?.parent?.id}/${categories[0]?.parent?.id}`,
                },
            ],
        };

        return breadcrumbLevels[index as keyof typeof breadcrumbLevels] ?? [baseBreadcrumb];
    };

    const breadcrumbs = getBreadcrumbs(index, categories);
    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Categories" />

                <div className="p-4">
                    <HeadingSmall title="Categories" description="Manage your product categories here" />

                    {index === 1 ? (
                        <Index1 categories={categories} />
                    ) : index === 2 ? (
                        <Index2 categories={categories} />
                    ) : (
                        <Index3 categories={categories} />
                    )}
                </div>
            </AppLayout>
        </>
    );
}

import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';

import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type BreadcrumbItem } from '@/types';

import DeleteUserDialog from '@/components/delete-user-dialog';
import { Badge } from '@/components/ui/badge';
import countriesData from '@/data/countries.json';
import { Eye, Plus, Trash } from 'lucide-react';

interface Filters {
    first_name?: string;
    last_name?: string;
    email?: string;
    role?: string;
    country?: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: route('users.index'),
    },
];

export default function Index({ users, filters }: { users: any; filters: Filters }) {
    const [values, setValues] = useState<Filters>(filters);
    const [userToDelete, setUserToDelete] = useState<any>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const debouncedSearch = useCallback(
        debounce((query: Filters) => {
            router.get(route('users.index'), query, {
                preserveState: true,
                preserveScroll: true,
            });
        }, 100),
        []
    );

    function handleReset() {
        setValues({});
        router.get(
            route('users.index'),
            {},
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    }

    useEffect(() => {
        debouncedSearch(values);
    }, [values]);

    function handleChange(key: keyof Filters, value: string) {
        setValues((values) => ({
            ...values,
            [key]: value,
        }));
    }

    const handleDelete = () => {
        if (!userToDelete) return;

        router.delete(route('users.destroy', userToDelete), {
            preserveScroll: true,
            onSuccess: () => {
                setShowDeleteDialog(false);
                setUserToDelete(null);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />

            <div className="space-y-4 p-4">
                <HeadingSmall title="Users" description="Manage users and their permissions" />

                <div className="space-y-2">
                    <h2>Search</h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <Input
                            placeholder="Search by first name..."
                            value={values.first_name || ''}
                            onChange={(e) => handleChange('first_name', e.target.value)}
                        />
                        <Input
                            placeholder="Search by last name..."
                            value={values.last_name || ''}
                            onChange={(e) => handleChange('last_name', e.target.value)}
                        />
                        <Input placeholder="Search by email..." value={values.email || ''} onChange={(e) => handleChange('email', e.target.value)} />

                        <Select value={values.role || 'all'} onValueChange={(value) => handleChange('role', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select user role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All roles</SelectItem>
                                <SelectItem value="customer">Customer</SelectItem>
                                <SelectItem value="seller">Seller</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={values.country || 'all'} onValueChange={(value) => handleChange('country', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All countries</SelectItem>
                                {Object.keys(countriesData).map((country) => (
                                    <SelectItem key={country} value={country}>
                                        {country}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                        <Link href={route('users.create')}>
                            <Button variant="outlined" size="sm">
                                <Plus /> Create New User
                            </Button>
                        </Link>

                        <Button variant="outline" size="sm" onClick={handleReset} disabled={!Object.values(values).some(Boolean)}>
                            Reset filters
                        </Button>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="rounded-md border">
                        <table className="w-full">
                            <thead className="">
                                <tr>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Name</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Email</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Role</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {users.data.map((user) => (
                                    <tr key={user.id}>
                                        <td className="px-4 py-2 text-sm">
                                            {user.first_name} {user.last_name}
                                        </td>
                                        <td className="px-4 py-2 text-sm">{user.email}</td>
                                        <td className="px-4 py-2 text-sm">
                                            <Badge className={user.role === 'customer' ? 'bg-green-500' : 'bg-red-500'}>{user.role}</Badge>
                                        </td>
                                        <td className="space-x-2 px-4 py-2 text-sm">
                                            <Link href={route('users.show', user)}>
                                                <Button variant="outlined" size="sm">
                                                    <Eye />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="outlined"
                                                size="sm"
                                                onClick={() => {
                                                    setUserToDelete(user);
                                                    setShowDeleteDialog(true);
                                                }}
                                            >
                                                <Trash />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                            Showing {users.from} to {users.to} of {users.total} results
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={!users.prev_page_url}
                                onClick={() =>
                                    router.get(users.prev_page_url || '', values, {
                                        preserveState: true,
                                        preserveScroll: true,
                                    })
                                }
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={!users.next_page_url}
                                onClick={() =>
                                    router.get(users.next_page_url || '', values, {
                                        preserveState: true,
                                        preserveScroll: true,
                                    })
                                }
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <DeleteUserDialog
                isOpen={showDeleteDialog}
                onClose={() => {
                    setShowDeleteDialog(false);
                    setUserToDelete(null);
                }}
                onConfirm={handleDelete}
                userName={userToDelete ? `${userToDelete.first_name} ${userToDelete.last_name}` : ''}
            />
        </AppLayout>
    );
}

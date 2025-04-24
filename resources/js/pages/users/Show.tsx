import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm } from '@inertiajs/react';
import React, { FormEventHandler } from 'react';

import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import countriesData from '@/data/countries.json';
import AppLayout from '@/layouts/app-layout';

type UserForm = {
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    country: string;
    city: string;
    address: string;
    phone: string;
    date_birth: string;
};

type PasswordForm = {
    password: string;
    password_confirmation: string;
};

type AvatarForm = {
    avatar: File | null;
};

type User = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    details?: {
        country?: string;
        city?: string;
        address?: string;
        phone?: string;
        date_birth?: string;
        avatar?: string;
    };
};

export default function Show({ user }: { user: User }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Users',
            href: '/users',
        },
        {
            title: user.first_name + ' ' + user.last_name,
            href: `/users/${user.id}`,
        },
    ];

    const [availableCities, setAvailableCities] = React.useState<string[]>(user.details?.country ? countriesData[user.details.country] || [] : []);

    const {
        data: userData,
        setData: setUserData,
        patch: updateUser,
        errors: userErrors,
        processing: userProcessing,
        recentlySuccessful: userSuccess,
    } = useForm<UserForm>({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        country: user.details?.country || '',
        city: user.details?.city || '',
        address: user.details?.address || '',
        phone: user.details?.phone || '',
        date_birth: user.details?.date_birth || '',
    });

    const {
        data: passwordData,
        setData: setPasswordData,
        patch: updatePassword,
        errors: passwordErrors,
        processing: passwordProcessing,
        recentlySuccessful: passwordSuccess,
        reset: resetPassword,
    } = useForm<PasswordForm>({
        password: '',
        password_confirmation: '',
    });

    const {
        data: avatarData,
        setData: setAvatarData,
        post: updateAvatar,
        errors: avatarErrors,
        processing: avatarProcessing,
        recentlySuccessful: avatarSuccess,
        reset: resetAvatar,
    } = useForm<AvatarForm>({
        avatar: null,
    });

    const handleCountryChange = (value: string) => {
        setUserData('country', value);
        setUserData('city', '');
        setAvailableCities(countriesData[value] || []);
    };

    const submitUser: FormEventHandler = (e) => {
        e.preventDefault();
        updateUser(route('users.update', user.id), {
            preserveScroll: true,
        });
    };

    const submitPassword: FormEventHandler = (e) => {
        e.preventDefault();
        updatePassword(route('users.update-password', user.id), {
            preserveScroll: true,
            onSuccess: () => resetPassword(),
        });
    };

    const submitAvatar: FormEventHandler = (e) => {
        e.preventDefault();
        updateAvatar(route('users.update-avatar', user.id), {
            preserveScroll: true,
            onSuccess: () => resetAvatar(),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`User: ${user.first_name} ${user.last_name}`} />

            <div className="space-y-6 p-4">
                <div className="space-y-6">
                    <HeadingSmall title="Profile Image" description="Update user's profile image" />

                    <div className="flex h-40 w-40 min-w-40 items-center justify-center overflow-hidden rounded-full bg-gray-500 text-7xl font-black shadow-md ring-2 shadow-gray-500 ring-gray-200">
                        {user.details?.avatar ? (
                            <img
                                className="h-full w-full object-cover"
                                src={`/storage/${user.details.avatar}`}
                                alt={user.first_name || 'User avatar'}
                            />
                        ) : (
                            user.first_name?.charAt(0) || 'U'
                        )}
                    </div>

                    <form onSubmit={submitAvatar} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="avatar">Upload Avatar</Label>
                            <Input
                                id="avatar"
                                type="file"
                                className="cursor-pointer"
                                accept="image/*"
                                onChange={(e) => setAvatarData('avatar', e.target.files?.[0] || null)}
                            />
                            <InputError message={avatarErrors.avatar} />
                        </div>

                        <Button type="submit" disabled={avatarProcessing}>
                            Upload
                        </Button>

                        <Transition
                            show={avatarSuccess}
                            enter="transition ease-in-out"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out"
                            leaveTo="opacity-0"
                        >
                            <p className="text-sm text-neutral-600">Avatar Updated</p>
                        </Transition>
                    </form>
                </div>

                <div className="space-y-6">
                    <HeadingSmall title="User Information" description="Update user's information and settings" />

                    <form onSubmit={submitUser} className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="first_name">First Name</Label>
                                <Input id="first_name" value={userData.first_name} onChange={(e) => setUserData('first_name', e.target.value)} />
                                <InputError message={userErrors.first_name} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="last_name">Last Name</Label>
                                <Input id="last_name" value={userData.last_name} onChange={(e) => setUserData('last_name', e.target.value)} />
                                <InputError message={userErrors.last_name} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" value={userData.email} onChange={(e) => setUserData('email', e.target.value)} />
                                <InputError message={userErrors.email} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Select value={userData.role} onValueChange={(value) => setUserData('role', value)}>
                                    <SelectTrigger id="role">
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="customer">Customer</SelectItem>
                                        <SelectItem value="seller">Seller</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={userErrors.role} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="country">Country</Label>
                                <Select value={userData.country} onValueChange={handleCountryChange}>
                                    <SelectTrigger id="country">
                                        <SelectValue placeholder="Select country" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.keys(countriesData).map((country) => (
                                            <SelectItem key={country} value={country}>
                                                {country}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={userErrors.country} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="city">City</Label>
                                <Select value={userData.city} onValueChange={(value) => setUserData('city', value)} disabled={!userData.country}>
                                    <SelectTrigger id="city">
                                        <SelectValue placeholder="Select city" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableCities.map((city) => (
                                            <SelectItem key={city} value={city}>
                                                {city}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={userErrors.city} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Input id="address" value={userData.address} onChange={(e) => setUserData('address', e.target.value)} />
                                <InputError message={userErrors.address} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input id="phone" value={userData.phone} onChange={(e) => setUserData('phone', e.target.value)} />
                                <InputError message={userErrors.phone} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="date_birth">Date of Birth</Label>
                                <Input
                                    id="date_birth"
                                    type="date"
                                    value={userData.date_birth}
                                    onChange={(e) => setUserData('date_birth', e.target.value)}
                                />
                                <InputError message={userErrors.date_birth} />
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <Button type="submit" disabled={userProcessing}>
                                Save Changes
                            </Button>

                            <Transition
                                show={userSuccess}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Saved</p>
                            </Transition>
                        </div>
                    </form>
                </div>

                <div className="space-y-6">
                    <HeadingSmall title="Change Password" description="Ensure the account is using a long, random password to stay secure." />

                    <form onSubmit={submitPassword} className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="password">New Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={passwordData.password}
                                    onChange={(e) => setPasswordData('password', e.target.value)}
                                />
                                <InputError message={passwordErrors.password} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation">Confirm Password</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    value={passwordData.password_confirmation}
                                    onChange={(e) => setPasswordData('password_confirmation', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <Button type="submit" disabled={passwordProcessing}>
                                Change Password
                            </Button>

                            <Transition
                                show={passwordSuccess}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Password Updated</p>
                            </Transition>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}

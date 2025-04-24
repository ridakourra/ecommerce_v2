import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm, usePage } from '@inertiajs/react';
import React, { FormEventHandler } from 'react';

import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import countriesData from '@/data/countries.json';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const countries = Object.keys(countriesData);

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile Details settings',
        href: '/settings/profile/details',
    },
];

type ProfileForm = {
    country: string;
    city: string;
    address: string;
    phone: string;
    date_birth: string;
};

export default function ProfileDetails() {
    const { auth } = usePage<SharedData>().props;
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<ProfileForm>({
        country: auth.user.details.country || '',
        city: auth.user.details.city || '',
        address: auth.user.details.address || '',
        phone: auth.user.details.phone || '',
        date_birth: auth.user.details.date_birth || '',
    });

    const [availableCities, setAvailableCities] = React.useState<string[]>(data.country ? countriesData[data.country] || [] : []);

    const handleCountryChange = (value: string) => {
        setData('country', value);
        setData('city', ''); // Reset city when country changes
        setAvailableCities(countriesData[value] || []);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('profile-details.update'), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile Details settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Profile Details" description="Update your profile information and settings" />

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <div className="grid gap-2">
                                <Label htmlFor="country">Country</Label>
                                <Select value={data.country} onValueChange={handleCountryChange}>
                                    <SelectTrigger id="country">
                                        <SelectValue placeholder="Select a country" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {countries.map((country) => (
                                            <SelectItem key={country} value={country}>
                                                {country}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError className="mt-2" message={errors.country} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="city">City</Label>
                                <Select value={data.city} onValueChange={(value) => setData('city', value)} disabled={!data.country}>
                                    <SelectTrigger id="city">
                                        <SelectValue placeholder="Select a city" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableCities.map((city) => (
                                            <SelectItem key={city} value={city}>
                                                {city}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError className="mt-2" message={errors.city} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    className="mt-1 block w-full"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    autoComplete="address"
                                    placeholder="Address"
                                />
                                <InputError className="mt-2" message={errors.address} />

                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    className="mt-1 block w-full"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    autoComplete="tel"
                                    placeholder="Phone"
                                />
                                <InputError className="mt-2" message={errors.phone} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="date_birth">Date of Birth</Label>
                                <Input
                                    id="date_birth"
                                    type="date"
                                    className="mt-1 block w-full"
                                    value={data.date_birth}
                                    onChange={(e) => setData('date_birth', e.target.value)}
                                    autoComplete="bday"
                                />
                                <InputError className="mt-2" message={errors.date_birth} />
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>Save</Button>

                            <Transition
                                show={recentlySuccessful}
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
            </SettingsLayout>
        </AppLayout>
    );
}

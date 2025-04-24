import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

type ProfileForm = {
    first_name: string;
    last_name: string;
    email: string;
};

type AvatarForm = {
    avatar: File | null;
};

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;

    const {
        data: profileData,
        setData: setProfileData,
        patch,
        errors: profileErrors,
        processing: profileProcessing,
        recentlySuccessful: profileSuccess,
    } = useForm<Required<ProfileForm>>({
        first_name: auth.user.first_name,
        last_name: auth.user.last_name,
        email: auth.user.email,
    });

    const {
        data: avatarData,
        setData: setAvatarData,
        post,
        errors: avatarErrors,
        processing: avatarProcessing,
        recentlySuccessful: avatarSuccess,
        reset,
    } = useForm<AvatarForm>({
        avatar: null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('profile.update'), {
            preserveScroll: true,
        });
    };

    const submitAvatar: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('profile-details.update-avatar'), {
            preserveScroll: true,
            onFinish: () => reset('avatar'),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Profile Image" description="Change your profile image" />

                    <div className="flex h-40 w-40 min-w-40 items-center justify-center overflow-hidden rounded-full bg-gray-500 text-7xl font-black shadow-md ring-2 shadow-gray-500 ring-gray-200">
                        {auth.user.details.avatar ? (
                            <>
                                <img className="h-full w-full object-cover" src={`/storage/${auth.user.details.avatar}`} />
                            </>
                        ) : (
                            auth?.user?.first_name.charAt(0)
                        )}
                    </div>

                    <form onSubmit={submitAvatar} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="profile_image">Upload Avatar</Label>

                            <Input
                                id="profile_image"
                                type="file"
                                className="mt-1 block w-full"
                                accept="image/*"
                                onChange={(e) => setAvatarData('avatar', e.target.files?.[0] || null)}
                            />

                            <InputError className="mt-2" message={avatarErrors.avatar} />
                        </div>

                        <Button type="submit" disabled={avatarProcessing}>
                            Upload
                        </Button>
                    </form>
                </div>

                <div className="space-y-6">
                    <HeadingSmall title="Profile information" description="Update your name and email address" />

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="first_name">First Name</Label>

                            <Input
                                id="first_name"
                                className="mt-1 block w-full"
                                value={profileData.first_name}
                                onChange={(e) => setProfileData('first_name', e.target.value)}
                                required
                                autoComplete="first_name"
                                placeholder="First name"
                            />

                            <InputError className="mt-2" message={profileErrors.first_name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="last_name">Last Name</Label>

                            <Input
                                id="last_name"
                                className="mt-1 block w-full"
                                value={profileData.last_name}
                                onChange={(e) => setProfileData('last_name', e.target.value)}
                                required
                                autoComplete="last_name"
                                placeholder="Last name"
                            />

                            <InputError className="mt-2" message={profileErrors.last_name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email address</Label>

                            <Input
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={profileData.email}
                                onChange={(e) => setProfileData('email', e.target.value)}
                                required
                                autoComplete="username"
                                placeholder="Email address"
                            />

                            <InputError className="mt-2" message={profileErrors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="role">Role</Label>

                            <Input id="role" className="mt-1 block w-full" value={auth.user.role} disabled required placeholder="Role" />

                            <InputError className="mt-2" message={profileErrors.role} />
                        </div>

                        {mustVerifyEmail && auth.user.email_verified_at === null && (
                            <div>
                                <p className="text-muted-foreground -mt-4 text-sm">
                                    Your email address is unverified.{' '}
                                    <Link
                                        href={route('verification.send')}
                                        method="post"
                                        as="button"
                                        className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                    >
                                        Click here to resend the verification email.
                                    </Link>
                                </p>

                                {status === 'verification-link-sent' && (
                                    <div className="mt-2 text-sm font-medium text-green-600">
                                        A new verification link has been sent to your email address.
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <Button disabled={profileProcessing}>Save</Button>

                            <Transition
                                show={profileSuccess}
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

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}

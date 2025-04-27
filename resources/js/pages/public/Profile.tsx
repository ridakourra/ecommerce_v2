import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DangerZone } from '@/components/ui/danger-zone';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordChange } from '@/components/ui/password-change';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import countriesData from '@/data/countries.json';
import Layout from '@/layouts/public/Layout';
import { Link, useForm } from '@inertiajs/react';
import { Camera, MapPin, Phone, User } from 'lucide-react';
import { useEffect, useState } from 'react';

interface UserDetails {
    country: string;
    city: string;
    address: string;
    phone: string;
    date_birth: string;
    avatar: string | null;
}

interface Props {
    auth: {
        user: {
            id: number;
            first_name: string;
            last_name: string;
            email: string;
            details: UserDetails | null;
        };
    };
}

export default function Profile({ auth, orders }: { auth: Props['auth'], orders: array}) {
    const [imagePreview, setImagePreview] = useState<string | null>(auth.user.details?.avatar ? `/storage/${auth.user.details.avatar}` : null);

    const { data, setData, post, processing, errors } = useForm({
        first_name: auth.user.first_name,
        last_name: auth.user.last_name,
        email: auth.user.email,
        country: auth.user.details?.country || '',
        city: auth.user.details?.city || '',
        address: auth.user.details?.address || '',
        phone: auth.user.details?.phone || '',
        date_birth: auth.user.details?.date_birth || '',
        avatar: null as File | null,
    });
    const [selectedCountry, setSelectedCountry] = useState(data.country || '');
    const [cities, setCities] = useState<string[]>([]);

    useEffect(() => {
        if (selectedCountry && countriesData[selectedCountry]) {
            setCities(countriesData[selectedCountry]);
        } else {
            setCities([]);
        }

        if (selectedCountry !== data.country) {
            setData('city', '');
        }
    }, [selectedCountry]);

    const handleCountryChange = (value: string) => {
        setSelectedCountry(value);
        setData('country', value);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('avatar', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('public.profile.update'));
    };

    const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist'>('profile');

    // Dummy data for demonstration

    return (
        <Layout title={'Profile ' + data.first_name}>
            <div className="container py-8">
                <div className="mx-auto max-w-4xl space-y-6">
                    {/* Profile Header */}
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="border-background bg-muted h-24 w-24 overflow-hidden rounded-full border-4">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Profile" className="h-full w-full object-cover" />
                                ) : (
                                    <User className="text-muted-foreground h-full w-full p-4" />
                                )}
                            </div>
                            <label
                                htmlFor="avatar"
                                className="border-background bg-primary text-primary-foreground hover:bg-primary/90 absolute -right-2 -bottom-2 cursor-pointer rounded-full border-2 p-2"
                            >
                                <Camera className="h-4 w-4" />
                                <input type="file" id="avatar" className="hidden" accept="image/*" onChange={handleImageChange} />
                            </label>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">
                                {auth.user.first_name} {auth.user.last_name}
                            </h1>
                            <p className="text-muted-foreground">{auth.user.email}</p>
                        </div>
                    </div>

                    {/* Buttons to choose view */}
                    <div className="flex gap-2 my-4">
                        <Button variant={activeTab === 'profile' ? 'default' : 'outline'} onClick={() => setActiveTab('profile')}>
                            Profile Data
                        </Button>
                        <Button variant={activeTab === 'orders' ? 'default' : 'outline'} onClick={() => setActiveTab('orders')}>
                            Orders
                        </Button>
                    </div>

                    {/* Conditional rendering */}
                    {activeTab === 'profile' && (
                        <>
                            <form onSubmit={submit} className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Personal Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="first_name">First Name</Label>
                                                <Input id="first_name" value={data.first_name} onChange={(e) => setData('first_name', e.target.value)} />
                                                {errors.first_name && <p className="text-destructive text-sm">{errors.first_name}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="last_name">Last Name</Label>
                                                <Input id="last_name" value={data.last_name} onChange={(e) => setData('last_name', e.target.value)} />
                                                {errors.last_name && <p className="text-destructive text-sm">{errors.last_name}</p>}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                                            {errors.email && <p className="text-destructive text-sm">{errors.email}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="date_birth">Date of Birth</Label>
                                            <Input
                                                id="date_birth"
                                                type="date"
                                                value={data.date_birth}
                                                onChange={(e) => setData('date_birth', e.target.value)}
                                            />
                                            {errors.date_birth && <p className="text-destructive text-sm">{errors.date_birth}</p>}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Contact Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <div className="relative">
                                                <Phone className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                                                <Input id="phone" className="pl-10" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                                            </div>
                                            {errors.phone && <p className="text-destructive text-sm">{errors.phone}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="address">Address</Label>
                                            <div className="relative">
                                                <MapPin className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                                                <Input
                                                    id="address"
                                                    className="pl-10"
                                                    value={data.address}
                                                    onChange={(e) => setData('address', e.target.value)}
                                                />
                                            </div>
                                            {errors.address && <p className="text-destructive text-sm">{errors.address}</p>}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Location Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="country">Country</Label>
                                                <Select value={data.country} onValueChange={handleCountryChange}>
                                                    <SelectTrigger>
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
                                                {errors.country && <p className="text-destructive text-sm">{errors.country}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="city">City</Label>
                                                <Select value={data.city} onValueChange={(value) => setData('city', value)} disabled={!selectedCountry}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select city" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {cities.map((city) => (
                                                            <SelectItem key={city} value={city}>
                                                                {city}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors.city && <p className="text-destructive text-sm">{errors.city}</p>}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="address">Street Address</Label>
                                            <Input
                                                id="address"
                                                value={data.address}
                                                onChange={(e) => setData('address', e.target.value)}
                                                placeholder="Enter your street address"
                                            />
                                            {errors.address && <p className="text-destructive text-sm">{errors.address}</p>}
                                        </div>
                                    </CardContent>
                                </Card>

                                <div className="flex justify-end">
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </div>
                            </form>
                            
                            <PasswordChange />
                            {/* Danger Zone */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-destructive">Delete account</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <DangerZone />
                                </CardContent>
                            </Card>
                        </>

                    )}

                    {activeTab === 'orders' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Your Orders</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {/* Render your orders table here */}
                                {orders.length === 0 ? (
                                    <div>No orders found.</div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b">
                                                    <th className="py-2 px-4 text-left">Order ID</th>
                                                    <th className="py-2 px-4 text-left">Date</th>
                                                    <th className="py-2 px-4 text-left">Status</th>
                                                    <th className="py-2 px-4 text-left">Total</th>
                                                    {/* <th className="py-2 px-4 text-left">Actions</th> */}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {orders.map((order) => (
                                                    <tr key={order.id} className="border-b hover:bg-muted/50">
                                                        <td className="py-2 px-4">#{order.id}</td>
                                                        <td className="py-2 px-4">{new Date(order.created_at).toLocaleDateString()}</td>
                                                        <td className="py-2 px-4">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                                ${order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                                order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                                                order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                                'bg-gray-100 text-gray-800'}`}>
                                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                            </span>
                                                        </td>
                                                        <td className="py-2 px-4">${Number(order.total_price).toFixed(2)}</td>
                                                        {/* <td className="py-2 px-4">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                asChild
                                                            >
                                                                <Link href={"route('public.orders.show', order.id)"}>
                                                                    View Details
                                                                </Link>
                                                            </Button>
                                                        </td> */}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                </div>
            </div>
        </Layout>
    );
}

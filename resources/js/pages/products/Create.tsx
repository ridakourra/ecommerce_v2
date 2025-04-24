import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { FormCurrency } from '@/components/ui/form/FormCurrency';
import { FormInput } from '@/components/ui/form/FormInput';
import { FormTextarea } from '@/components/ui/form/FormTextarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { SelectValue } from '@radix-ui/react-select';
import axios from 'axios';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create New Product',
        href: route('products.create'),
    },
];

export default function Create({ departments }) {
    const [Departments, setDepartments] = useState(departments);
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);
    const [diasbleC, setDisableC] = useState(true);
    const [diasbleT, setDisableT] = useState(true);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        brand: '',
        image: null,
        price: '',
        discount: '',
        archived: false,
        stock: '',
        department: '',
        category: '',
        type: '',
        description: '',
    });

    const handleChangeDepartments = async (value) => {
        setData('department', value);
        try {
            const response = await axios.get(route('getCategoriesById', value));
            setCategories(response.data.categories);
            setDisableC(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleChangeCategories = async (value) => {
        setData('category', value);
        try {
            const response = await axios.get(route('getCategoriesById', value));
            setTypes(response.data.categories);
            setDisableT(false);
        } catch (error) {
            console.error(error);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('products.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="New Product" />

            <div className="space-y-6 p-5">
                <HeadingSmall title="Create new product" description="Create new product to stock it in database" />

                <form onSubmit={submit} className="space-y-4">
                    {/* Basic Info */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <FormInput
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            label="Name"
                            id="name"
                            placeholder="Enter product name..."
                            error={errors.name}
                        />
                        <FormInput
                            value={data.brand}
                            onChange={(e) => setData('brand', e.target.value)}
                            label="Brand"
                            id="brand"
                            placeholder="Enter product brand..."
                            error={errors.brand}
                        />
                    </div>

                    {/* Image Upload */}
                    <FormInput
                        onChange={(e) => setData('image', e.target.files[0])}
                        label="Image"
                        id="image"
                        type="file"
                        accept="image/*"
                        error={errors.image}
                    />

                    {/* Price and Discount */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <FormCurrency
                            value={data.price}
                            onChange={(value) => setData('price', value)}
                            label="Price"
                            placeholder="0.00"
                            error={errors.price}
                        />
                        <FormInput
                            value={data.discount}
                            onChange={(e) => setData('discount', e.target.value)}
                            label="Discount (%)"
                            type="number"
                            min="0"
                            max="100"
                            placeholder="Enter discount percentage..."
                            error={errors.discount}
                        />
                    </div>

                    <div className="w-full">
                        <FormInput
                            value={data.stock}
                            onChange={(e) => setData('stock', e.target.value)}
                            label="Stock"
                            type="number"
                            min="0"
                            placeholder="Enter stock quantity..."
                            error={errors.stock}
                        />
                    </div>

                    {/* Categories Selection */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <div>
                            <Label>Departments</Label>
                            <Select value={data.department} onValueChange={handleChangeDepartments}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Department..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {Departments.map((item) => (
                                        <SelectItem key={item.id} value={String(item.id)}>
                                            {item.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.department} />
                        </div>

                        <div>
                            <Label>Categories</Label>
                            <Select value={data.category} onValueChange={handleChangeCategories} disabled={diasbleC}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Category..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((item) => (
                                        <SelectItem key={item.id} value={String(item.id)}>
                                            {item.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.category} />
                        </div>

                        <div>
                            <Label>Types</Label>
                            <Select value={data.type} onValueChange={(value) => setData('type', value)} disabled={diasbleT}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Type..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {types.map((item) => (
                                        <SelectItem key={item.id} value={String(item.id)}>
                                            {item.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.type} />
                        </div>
                    </div>

                    {/* Description */}
                    <FormTextarea
                        label="Description"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        error={errors.description}
                    />

                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save Product'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

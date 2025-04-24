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
import { Trash } from 'lucide-react';
import { useState } from 'react';

interface Props {
    product: {
        id: number;
        name: string;
        brand: string;
        image: string;
        description: string;
        category_id: string;
        price: number;
        discount: number;
        status: string;
        archived: boolean;
        stock: number;
    };
    departments: {
        data: Array<{
            id: number;
            name: string;
        }>;
        selected: number;
    };
    categories: {
        data: Array<{
            id: number;
            name: string;
        }>;
        selected: number;
    };
    types: {
        data: Array<{
            id: number;
            name: string;
        }>;
        selected: number;
    };
}

export default function Edit({ product, departments, categories, types }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Products',
            href: route('products.index'),
        },
        {
            title: 'Edit Product',
            href: route('products.edit', product.id),
        },
    ];

    const [Departments, setDepartments] = useState(departments.data);
    const [Categories, setCategories] = useState(categories.data);
    const [Types, setTypes] = useState(types.data);
    const [diasbleC, setDisableC] = useState(false);
    const [diasbleT, setDisableT] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        name: product.name,
        brand: product.brand,
        image: null,
        price: String(product.price),
        discount: String(product.discount),
        archived: product.archived,
        stock: String(product.stock),
        department: String(departments.selected),
        category: String(categories.selected),
        type: String(types.selected),
        description: product.description,
    });

    const handleChangeDepartments = async (value: string) => {
        setData('department', value);
        try {
            const response = await axios.get(route('getCategoriesById', value));
            setCategories(response.data.categories);
            setDisableC(false);
            // Reset category and type when department changes
            setData('category', '');
            setData('type', '');
            setTypes([]);
            setDisableT(true);
        } catch (error) {
            console.error(error);
        }
    };

    const handleChangeCategories = async (value: string) => {
        setData('category', value);
        try {
            const response = await axios.get(route('getCategoriesById', value));
            setTypes(response.data.categories);
            setDisableT(false);
            // Reset type when category changes
            setData('type', '');
        } catch (error) {
            console.error(error);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const resetImage = () => {
        setData('image', null);
        setImagePreview(null);
        // Clear the file input
        const fileInput = document.getElementById('image') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('products.update', product.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${product.name}`} />

            <div className="space-y-6 p-5">
                <HeadingSmall title="Edit product" description="Update product information in database" />

                <form onSubmit={submit} className="space-y-4">
                    <FormInput
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        label="Name"
                        id="name"
                        placeholder="Enter product name..."
                        error={errors.name}
                    />

                    <div className="space-y-2">
                        <div className="flex items-center gap-4">
                            {imagePreview ? (
                                <div className="relative">
                                    <img src={imagePreview} alt="Preview" className="h-32 w-32 rounded-md object-cover" />
                                    <Button type="button" onClick={resetImage} size="sm" className="absolute -top-2 -right-2 text-white">
                                        <Trash />
                                    </Button>
                                </div>
                            ) : product.image ? (
                                <img src={`/storage/${product.image}`} alt={product.name} className="h-32 w-32 rounded-md object-cover" />
                            ) : (
                                <div className="flex h-32 w-32 items-center justify-center rounded-md border border-dashed">No image</div>
                            )}
                        </div>
                        <FormInput onChange={handleImageChange} label="Change Image" id="image" type="file" accept="image/*" />
                    </div>

                    <FormInput
                        value={data.brand}
                        onChange={(e) => setData('brand', e.target.value)}
                        label="Brand"
                        id="brand"
                        placeholder="Enter product brand..."
                        error={errors.brand}
                    />

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
                    </div>

                    <div>
                        <Label>Categories</Label>
                        <Select value={data.category} onValueChange={handleChangeCategories} disabled={diasbleC}>
                            <SelectTrigger>
                                <SelectValue placeholder="Category..." />
                            </SelectTrigger>
                            <SelectContent>
                                {Categories.map((item) => (
                                    <SelectItem key={item.id} value={String(item.id)}>
                                        {item.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Types</Label>
                        <Select value={data.type} onValueChange={(value) => setData('type', value)} disabled={diasbleT}>
                            <SelectTrigger>
                                <SelectValue placeholder="Type..." />
                            </SelectTrigger>
                            <SelectContent>
                                {Types.map((item) => (
                                    <SelectItem key={item.id} value={String(item.id)}>
                                        {item.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.type} />
                    </div>

                    <FormTextarea
                        label="Description"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        error={errors.description}
                    />

                    <Button disabled={processing}>{processing ? 'Saving...' : 'Update'}</Button>
                </form>
            </div>
        </AppLayout>
    );
}

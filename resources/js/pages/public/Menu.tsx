import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { AddToCart, DestroyCart } from '@/functions/Cart';
import Layout from '@/layouts/public/Layout';
import { cn } from '@/lib/utils';
import { Product } from '@/types';
import { Link, router } from '@inertiajs/react';
import debounce from 'lodash/debounce';
import { ArrowLeft, Eye, Filter, Heart, Search, ShoppingCart, SlidersHorizontal } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PaginatedProducts {
    data: Product[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
}

interface Props {
    products: PaginatedProducts;
    categories: Array<{ id: number; name: string }>;
    brands: string[];
    filters?: {
        search?: string;
        category?: string;
        brand?: string;
        minPrice?: string;
        maxPrice?: string;
        sort?: string;
        page?: string;
    };
}

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    discount: number;
    image: string;
    brand: string;
    inCart: boolean;
    category: {
        id: number;
        name: string;
    };
}

function ProductCard({ product }: { product: Product }) {
    // Convert strings to numbers and handle null/undefined values
    const price = Number(product.price) || 0;
    const discount = Number(product.discount) || 0;
    const discountedPrice = discount > 0 ? price - (price * discount) / 100 : price;

    return (
        <Card className="group overflow-hidden transition-all hover:shadow-lg">
            <div className="relative aspect-[4/3] overflow-hidden">
                <img
                    src={`/storage/${product.image}`}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />
                {/* <div className="absolute top-2 right-2">
                    <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full">
                        <Heart className="h-4 w-4" />
                    </Button>
                </div> */}
                {product.discount > 0 && <Badge className="absolute top-2 left-2 bg-red-500">-{product.discount}%</Badge>}
            </div>
            <CardContent className="p-3">
                <div className="mb-1.5 flex items-center justify-between gap-2">
                    <Badge variant="outline" className="text-xs">
                        {product.brand}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                        {product.category.name}
                    </Badge>
                </div>
                <h3 className="mb-2 line-clamp-1 text-sm font-medium">{product.name}</h3>
                <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-col">
                        <span className="font-semibold">${discountedPrice.toFixed(2)}</span>
                        {discount > 0 && <span className="text-muted-foreground text-xs line-through">${price.toFixed(2)}</span>}
                    </div>
                    <div className="flex gap-2">
                        {product.inCart ? (
                            <Button size="sm" variant="destructive" onClick={() => DestroyCart(product.id)}>
                                <ArrowLeft />
                            </Button>
                        ) : (
                            <Button size="sm" onClick={() => AddToCart(product.id)}>
                                <ShoppingCart />
                            </Button>
                        )}
                        <Button size="sm" variant="link">
                            <Link href={route('public.products.show', product.id)}>
                                <Eye />
                            </Link>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <Card className="p-4">
            <CardHeader className="p-0 pb-4">
                <CardTitle className="text-base font-semibold">{title}</CardTitle>
            </CardHeader>
            {children}
        </Card>
    );
}

export default function Menu({ products, categories, brands, filters = {} }: Props) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [priceRange, setPriceRange] = useState([parseInt(filters.minPrice || '0'), parseInt(filters.maxPrice || '1000')]);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const currentSort = filters.sort || 'newest';

    useEffect(() => {
        setPriceRange([parseInt(filters.minPrice || '0'), parseInt(filters.maxPrice || '1000')]);
    }, [filters.minPrice, filters.maxPrice]);

    const debouncedSearch = debounce((value: string) => {
        updateFilters({ search: value, page: '1' });
    }, 300);

    const updateFilters = (newFilters: Partial<Props['filters']>) => {
        router.get(route('menu'), { ...filters, ...newFilters }, { preserveScroll: true, preserveState: true });
    };

    return (
        <Layout title="Our Products">
            <div className="container py-8">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold">Our Products</h1>
                    <p className="text-muted-foreground mt-2">Discover our collection of amazing products</p>
                </div>

                <div className="mb-4 flex items-center justify-between lg:hidden">
                    <Button variant="outline" onClick={() => setIsFilterOpen(!isFilterOpen)}>
                        <Filter className="mr-2 h-4 w-4" />
                        {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
                    </Button>
                    <Select value={currentSort} onValueChange={(value) => updateFilters({ sort: value })}>
                        <SelectTrigger className="w-[180px]">
                            <SlidersHorizontal className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest Arrivals</SelectItem>
                            <SelectItem value="price-asc">Price: Low to High</SelectItem>
                            <SelectItem value="price-desc">Price: High to Low</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
                    <div className={cn('space-y-6', !isFilterOpen && 'hidden lg:block')}>
                        <FilterSection title="Search Products">
                            <div className="relative">
                                <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                                <Input
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        debouncedSearch(e.target.value);
                                    }}
                                    className="pl-9"
                                />
                            </div>
                        </FilterSection>

                        <FilterSection title="Categories">
                            <div className="space-y-2">
                                {categories.map((category) => (
                                    <div key={category.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`category-${category.id}`}
                                            checked={filters.category === String(category.id)}
                                            onCheckedChange={() =>
                                                updateFilters({
                                                    category: filters.category === String(category.id) ? undefined : String(category.id),
                                                    page: '1',
                                                })
                                            }
                                        />
                                        <label htmlFor={`category-${category.id}`} className="text-sm">
                                            {category.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </FilterSection>

                        <FilterSection title="Brands">
                            <div className="space-y-2">
                                {brands.map((brand) => (
                                    <div key={brand} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`brand-${brand}`}
                                            checked={filters.brand === brand}
                                            onCheckedChange={() =>
                                                updateFilters({
                                                    brand: filters.brand === brand ? undefined : brand,
                                                    page: '1',
                                                })
                                            }
                                        />
                                        <label htmlFor={`brand-${brand}`} className="text-sm">
                                            {brand}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </FilterSection>

                        <FilterSection title="Price Range">
                            <Slider
                                value={priceRange}
                                min={0}
                                max={1000}
                                step={10}
                                onValueChange={setPriceRange}
                                onValueCommit={(value) =>
                                    updateFilters({
                                        minPrice: String(value[0]),
                                        maxPrice: String(value[1]),
                                        page: '1',
                                    })
                                }
                            />
                            <div className="mt-4 flex items-center justify-between">
                                <span className="text-muted-foreground text-sm">${priceRange[0]}</span>
                                <span className="text-muted-foreground text-sm">${priceRange[1]}</span>
                            </div>
                        </FilterSection>
                    </div>

                    <div className="space-y-6">
                        <div className="hidden items-center justify-between lg:flex">
                            <p className="text-muted-foreground text-sm">
                                Showing {products.data.length} of {products.total} products
                            </p>
                            <Select value={currentSort} onValueChange={(value) => updateFilters({ sort: value })}>
                                <SelectTrigger className="w-[200px]">
                                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="newest">Newest Arrivals</SelectItem>
                                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                            {products.data.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {products.last_page > 1 && (
                            <div className="mt-8 flex items-center justify-center gap-2">
                                {Array.from({ length: products.last_page }, (_, i) => (
                                    <Button
                                        key={i + 1}
                                        variant={products.current_page === i + 1 ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => updateFilters({ page: String(i + 1) })}
                                    >
                                        {i + 1}
                                    </Button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

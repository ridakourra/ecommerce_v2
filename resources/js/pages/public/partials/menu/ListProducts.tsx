import ProductCard2 from '@/components/products/ProductCard2';

export default function ListProducts({ products }) {
    return (
        <div className="grid-cols-2 grid w-full gap-4 p-5 md:grid-cols-3 lg:grid-cols-5">
            {products.map((product, key) => (
                <ProductCard2 key={key} product={product} />
            ))}
        </div>
    );
}

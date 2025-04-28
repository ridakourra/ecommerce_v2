import Heading from '@/components/heading';
import Pagination from '@/components/ui/Pagination';
import Layout from '@/layouts/public/Layout';
import FilterSection from './partials/menu/FilterSection';
import ListProducts from './partials/menu/ListProducts';

export default function Menu({ products, brands, filters }) {
    return (
        <Layout title="Menu">
            <Heading title="List Products" description="Search and Filter what you want..." />

            <FilterSection Filters={filters} brands={brands} />

            <ListProducts products={products.data} />

            <Pagination links={products.links} />
        </Layout>
    );
}

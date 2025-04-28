import Layout from '@/layouts/public/Layout';
import BestCategories from './partials/home/BestCategories';
import HerSection from './partials/home/HeroSection';
import Products from './partials/home/Products';

export default function Home({ products, bestProducts }) {
    return (
        <Layout title="Home">
            <HerSection />

            <BestCategories bestProducts={bestProducts} />

            <Products products={products} />
        </Layout>
    );
}

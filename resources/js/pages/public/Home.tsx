import Layout from '@/layouts/public/Layout';
import FeatureCategories from './partials/home/FeatureCategories';
import HerSection from './partials/home/HeroSection';
import Products from './partials/home/Products';

export default function Home({ products }) {
    return (
        <Layout title="Home">
            <HerSection />

            <FeatureCategories />

            <Products products={products} />
        </Layout>
    );
}

import { Head } from '@inertiajs/react';
import Footer from './Footer';
import Header from './Header';

export default function Layout({ title, children }) {
    return (
        <>
            <div className="bg-background min-h-screen">
                <Head title={title} />
                <div className="container mx-auto">
                    <Header />
                    <main className="container mx-auto md:p-5">{children}</main>
                    <Footer />
                </div>
            </div>
        </>
    );
}

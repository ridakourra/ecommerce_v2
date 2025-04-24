import { Link } from '@inertiajs/react';

export default function FeatureCategories() {
    return (
        <section className="bg-muted/50 px-4 py-16 md:px-6 lg:px-8">
            <div className="container">
                <h2 className="mb-8 text-center text-3xl font-bold">Featured Categories</h2>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {[
                        { name: 'Fashion', image: 'https://i.insider.com/5e90a4910b3c9b4cd42a1605' },
                        { name: 'Sports', image: 'https://photobooth.cdn.sports.ru/preset/post/c/07/421679d7847ca9253c4e7e193671a.jpeg' },
                        { name: 'Electronics', image: 'https://sa.tinhte.vn/2017/10/4146812_Google_Pixel_XL_2_Pixel_Book_HTC_AI_4.jpg' },
                        { name: 'Home', image: 'https://img.dmclk.ru/s1920x1080q80/blog/mVi5o7Mi_efev3oj.jpg' },
                    ].map((category) => (
                        <Link
                            key={category.name}
                            href={`/categories/${category.name.toLowerCase()}`}
                            className="group relative overflow-hidden rounded-lg"
                        >
                            <div className="aspect-square w-full">
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/40 transition-opacity duration-300 group-hover:bg-black/50" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <h3 className="text-xl font-bold text-white">{category.name}</h3>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

import { useEffect, useState } from 'react';

export default function Test() {
    // الحالة لتخزين الصور
    const [images, setImages] = useState([]);
    const [query, setQuery] = useState('iphone'); // البحث الافتراضي

    // مفتاح API الخاص بك من Unsplash
    const apiKey = 'G6DSuKqTrnxdHK2tMNQdM3UkkA9zENEVyNhq3jM2BkE'; // استبدل هذا بمفتاح الـ API الذي حصلت عليه

    // جلب الصور من Unsplash API
    const fetchImages = async () => {
        try {
            const response = await fetch(`https://api.unsplash.com/search/photos?query=${query}&client_id=${apiKey}&per_page=31`);
            const data = await response.json();
            setImages(data.results); // تخزين النتائج في الحالة
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    };

    // استخدام useEffect لتحميل الصور عند تحميل المكون
    useEffect(() => {
        fetchImages();
    }, [query]); // يتم التحديث عندما يتغير الاستعلام

    return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold">Search for images on Unsplash</h1>

            {/* حقل البحث */}
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="mt-2 rounded border p-2"
                placeholder="Search images"
            />

            {/* عرض الصور */}
            <div className="mt-4 grid grid-cols-3 gap-4">
                {images.length > 0 ? (
                    images.map((image) => (
                        <div key={image.id} className="overflow-hidden rounded border shadow-md">
                            <img src={image.urls.small} alt={image.description || 'Unsplash image'} className="h-auto w-full" />
                        </div>
                    ))
                ) : (
                    <p>No images found.</p>
                )}
            </div>
        </div>
    );
}

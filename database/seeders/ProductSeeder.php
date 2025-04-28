<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $subCategories = Category::whereNotNull('parent_id')
            ->whereDoesntHave('children')
            ->pluck('id')
            ->toArray();

        $brands = [
            'Samsung',
            'Apple',
            'Sony',
            'Nike',
            'Adidas',
            'LG',
            'Dell',
            'HP',
            'Asus',
            'Puma',
            'Rolex',
            'Gucci',
            'Lenovo',
            'Huawei',
            'Canon'
        ];

        $productNames = [
            // Electronics > Smartphones
            'iPhone 14 Pro',
            'Samsung Galaxy S23',
            'Google Pixel 7',
            'OnePlus 11',
            'Xiaomi Mi 12',
            // Electronics > Computers
            'MacBook Pro 16',
            'Dell XPS 13',
            'HP Spectre x360',
            'Asus ROG Zephyrus',
            'Lenovo ThinkPad X1',
            // Electronics > TV & Audio
            'Sony Bravia 65" 4K',
            'LG OLED C2',
            'Samsung QLED Q80B',
            'Bose SoundLink Speaker',
            'Sony WH-1000XM5 Headphones',

            // Fashion > Men's Clothing
            'Nike Air Max T-Shirt',
            'Levi\'s 501 Jeans',
            'Armani Men\'s Suit',
            'Adidas Hoodie',
            'Puma Sports Jacket',
            // Fashion > Women's Clothing
            'Zara Summer Dress',
            'Gucci Silk Top',
            'H&M Pleated Skirt',
            'Dior Evening Dress',
            'Chanel Casual Top',
            // Fashion > Accessories
            'Michael Kors Handbag',
            'Rolex Submariner Watch',
            'Tiffany & Co. Necklace',
            'Fossil Leather Wallet',
            'Casio G-Shock Watch',

            // Home & Garden > Furniture
            'IKEA Ektorp Sofa',
            'Wayfair Office Desk',
            'Ashley Queen Bed',
            'La-Z-Boy Recliner',
            'IKEA Poäng Chair',
            // Home & Garden > Kitchen
            'KitchenAid Mixer',
            'Ninja Air Fryer',
            'Cuisinart Cookware Set',
            'T-fal Nonstick Pans',
            'Instant Pot Duo 7-in-1',
            // Home & Garden > Garden
            'Fiskars Garden Tools',
            'Monstera Indoor Plant',
            'Outsunny Patio Set',
            'Gardena Smart Irrigation',
            'Weber Spirit Grill',

            // Sports & Outdoor > Fitness
            'Peloton Bike',
            'Bowflex Dumbbells',
            'Manduka Yoga Mat',
            'Fitbit Charge 5',
            'Nike Training Equipment',
            // Sports & Outdoor > Outdoor Activities
            'Coleman Camping Tent',
            'North Face Hiking Backpack',
            'Trek Marlin 7 Bike',
            'Garmin GPS Watch',
            'CamelBak Hydration Pack',
            // Sports & Outdoor > Sports Equipment
            'Wilson Basketball',
            'Adidas Football',
            'Yonex Tennis Racket',
            'Spalding NBA Basketball',
            'Nike Mercurial Soccer Cleats'
        ];

        $totalProducts = 100;
        $productCount = count($productNames);

        for ($i = 1; $i <= $totalProducts; $i++) {
            Product::create([
                'name' => $productNames[($i - 1) % $productCount],
                'description' => fake()->paragraph(),
                'status' => 'approved',
                'archived' => false,
                'brand' => $brands[array_rand($brands)],
                'image' => 'products/' . $i . '.jpg',
                'stock' => rand(5, 100),
                'price' => rand(50, 1500),
                'discount' => rand(0, 40),
                'category_id' => $subCategories[array_rand($subCategories)],
                'user_id' => 1,
            ]);
        }
    }
}

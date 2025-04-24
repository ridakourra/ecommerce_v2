<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        // Departments (Main Categories)
        $departments = [
            'Electronics' => [
                'Smartphones' => [
                    'Android Phones',
                    'iPhones',
                    'Accessories'
                ],
                'Computers' => [
                    'Laptops',
                    'Desktop PCs',
                    'Computer Components'
                ],
                'TV & Audio' => [
                    'TVs',
                    'Speakers',
                    'Headphones'
                ]
            ],
            'Fashion' => [
                "Men's Clothing" => [
                    'T-Shirts',
                    'Jeans',
                    'Suits'
                ],
                "Women's Clothing" => [
                    'Dresses',
                    'Tops',
                    'Skirts'
                ],
                'Accessories' => [
                    'Bags',
                    'Jewelry',
                    'Watches'
                ]
            ],
            'Home & Garden' => [
                'Furniture' => [
                    'Living Room',
                    'Bedroom',
                    'Office'
                ],
                'Kitchen' => [
                    'Appliances',
                    'Cookware',
                    'Utensils'
                ],
                'Garden' => [
                    'Tools',
                    'Plants',
                    'Outdoor Furniture'
                ]
            ],
            'Sports & Outdoor' => [
                'Fitness' => [
                    'Exercise Equipment',
                    'Yoga & Pilates',
                    'Weights'
                ],
                'Outdoor Activities' => [
                    'Camping',
                    'Hiking',
                    'Cycling'
                ],
                'Sports Equipment' => [
                    'Football',
                    'Basketball',
                    'Tennis'
                ]
            ],
        ];

        foreach ($departments as $departmentName => $categories) {
            $department = Category::create([
                'name' => $departmentName,
                'description' => fake()->paragraph(),
                'flag' => 'department'
            ]);

            foreach ($categories as $categoryName => $subCategories) {
                $category = Category::create([
                    'name' => $categoryName,
                    'description' => fake()->paragraph(),
                    'parent_id' => $department->id
                ]);

                foreach ($subCategories as $subCategoryName) {
                    Category::create([
                        'name' => $subCategoryName,
                        'description' => fake()->paragraph(),
                        'parent_id' => $category->id
                    ]);
                }
            }
        }
    }
}

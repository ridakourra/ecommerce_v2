<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        User::factory()->create([
            'first_name' => 'Admin',
            'last_name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => bcrypt('admin@example.com'),
            'role' => 'admin'
        ]);

        User::find(1)->details()->create([
            'user_id' => 1
        ]);

        User::factory(20)->create();



        $this->call([
            CategorySeeder::class,
            ProductSeeder::class
        ]);
    }
}

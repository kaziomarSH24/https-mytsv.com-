<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Location;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        User::create([
            'name' => 'TSV',
            'full_name' => 'Admin Admin',
            'email' => 'admin@admin.com',
            'password' => Hash::make('123'),
            'admin' => 1,
        ]);
        Category::create([
            'title' => 'Plumbers',
        ]);
        Location::create([
            'title' => 'Test',
        ]);
    }
}

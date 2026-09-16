<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Medicine;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Default required pharmacist account
        User::create([
            'name' => 'pharmacist',
            'email' => 'pharmacist@pharmacy.local',
            'password' => Hash::make('med123'),
        ]);

        // Sample initial medicine records
        Medicine::create([
            'name' => 'Biogesic',
            'category' => 'Analgesic / Antipyretic',
            'quantity' => 150,
            'price' => 10.0,
        ]);

        Medicine::create([
            'name' => 'Amoxicillin',
            'category' => 'Antibiotic',
            'quantity' => 80,
            'price' => 25.0,
        ]);

        Medicine::create([
            'name' => 'Ascorbic Acid',
            'category' => 'Vitamin C',
            'quantity' => 500,
            'price' => 15.0,
        ]);

         Medicine::create([
            'name' => 'Myra E',
            'category' => 'Beauty Supplement/ Vitamin E',
            'quantity' => 500,
            'price' => 169.0,
        ]);

         Medicine::create([
            'name' => 'Sisters',
            'category' => 'Feminine/hygine',
            'quantity' => 500,
            'price' => 22.0,
        ]);
    }
}

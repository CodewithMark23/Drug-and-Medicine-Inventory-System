<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MedicineController;

// Authentication Endpoints
Route::post('/api/login', [AuthController::class, 'login']);
Route::post('/api/logout', [AuthController::class, 'logout']);
Route::get('/api/user', [AuthController::class, 'user']);

// Medicine Inventory CRUD Endpoints
Route::get('/api/medicines', [MedicineController::class, 'index']);
Route::post('/api/medicines', [MedicineController::class, 'store']);
Route::get('/api/medicines/{id}', [MedicineController::class, 'show']);
Route::put('/api/medicines/{id}', [MedicineController::class, 'update']);
Route::delete('/api/medicines/{id}', [MedicineController::class, 'destroy']);

// SPA Fallback Route (Load React single page app for all browser routes)
Route::get('/{any?}', function () {
    return view('app');
})->where('any', '.*');

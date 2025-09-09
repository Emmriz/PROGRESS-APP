<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\SubmissionController;
use App\Http\Controllers\Auth\ApiLoginController;
use Illuminate\Http\Request;

// Authentication routes
Route::post('/register', [RegisteredUserController::class, 'store']);
// Route::post('/login', [AuthenticatedSessionController::class, 'store']);
Route::post('/login', [ApiLoginController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);

    // Submissions routes
    Route::post('/submissions', [SubmissionController::class, 'store']);
    Route::get('/submissions', [SubmissionController::class, 'index']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [ApiLoginController::class, 'logout']);
    // Route::post('/logout-all', [ApiLoginController::class, 'logoutAll']); // optional
});

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

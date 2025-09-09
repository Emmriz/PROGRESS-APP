<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SubmissionController;

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/submissions', [SubmissionController::class, 'store']);
    Route::get('/submissions', [SubmissionController::class, 'index']);
});

require __DIR__.'/auth.php';

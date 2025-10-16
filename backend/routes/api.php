<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\AuthController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/feed', [PostController::class, 'feed']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

// borrar para el commit
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
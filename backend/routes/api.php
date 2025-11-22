<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AiContentController;
use App\Http\Controllers\Api\RecommendationsController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/feed', [PostController::class, 'feed']);
    Route::get('/explore', [PostController::class, 'explore']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/getInfoOfAUsername', [AuthController::class, 'getInfoOfAUsername']);
    Route::get('/getPostsOfAUser', [PostController::class, 'getPostsOfAUser']);
    Route::get('/getPostsReactedOfAUser', [PostController::class, 'getPostsReactedOfAUser']);
    Route::post('/postPost', [PostController::class, 'postPost']);
    Route::post('/reactToAPost', [PostController::class, 'reactToAPost']);
    Route::post('/commentToAPost', [PostController::class, 'commentToAPost']);
    Route::get('/getCommentsOfAUser', [PostController::class, 'getCommentsOfAUser']);
    Route::get('/getPost', [PostController::class, 'getPost']);
    Route::get('/getCommentsOfAPost', [PostController::class, 'getCommentsOfAPost']);
    Route::post('/follow', [AuthController::class, 'follow']);
    Route::post('/unfollow', [AuthController::class, 'unfollow']);
    Route::get('/users/{username}/followers', [AuthController::class, 'getFollowers']);
    Route::get('/users/{username}/following', [AuthController::class, 'getFollowing']);
    
    // Settings routes
    Route::get('/settings', [App\Http\Controllers\Api\SettingsController::class, 'getSettings']);
    Route::put('/settings/profile', [App\Http\Controllers\Api\SettingsController::class, 'updateProfile']);
    Route::put('/settings/privacy', [App\Http\Controllers\Api\SettingsController::class, 'updatePrivacySettings']);
    Route::put('/settings/notifications', [App\Http\Controllers\Api\SettingsController::class, 'updateNotificationSettings']);
    Route::put('/settings/password', [App\Http\Controllers\Api\SettingsController::class, 'changePassword']);
    Route::delete('/settings/account', [App\Http\Controllers\Api\SettingsController::class, 'deleteAccount']);
    
    // Recommendations routes
    Route::get('/recommendations/users', [RecommendationsController::class, 'getSuggestedUsers']);
    Route::get('/recommendations/trending', [RecommendationsController::class, 'getTrendingTopics']);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::post('/aiContent', [AiContentController::class, 'index']);



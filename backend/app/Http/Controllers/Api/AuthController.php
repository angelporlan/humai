<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Cache;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required|string|max:50|unique:users',
            'email' => 'required|string|email|max:100|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $user = User::create([
            'username' => $validated['username'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    public function getInfoOfAUsername(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required|string|max:50',
        ]);

        $cacheKey = "user_info_{$validated['username']}_requester_" . ($request->user() ? $request->user()->id : 'guest');

        $userData = Cache::remember($cacheKey, now()->addSeconds(1), function () use ($validated, $request) {
            $user = User::where('username', $validated['username'])
                ->withCount(['followers', 'following', 'posts'])
                ->first();

            if (!$user) {
                return null;
            }

            $isFollowing = $request->user() ? $request->user()->isFollowing($user) : false;

            return [
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
                'name' => $user->name,
                'avatar' => $user->avatar,
                'bio' => $user->bio,
                'followers_count' => $user->followers_count,
                'following_count' => $user->following_count,
                'posts_count' => $user->posts_count,
                'is_following' => $isFollowing,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at
            ];
        });

        if (!$userData) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json($userData);
    }
    

    public function follow(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required|string|max:50',
        ]);

        $userToFollow = User::where('username', $validated['username'])->first();

        if (!$userToFollow) {
            return response()->json(['message' => 'User not found'], 404);
        }

        if ($request->user()->id === $userToFollow->id) {
            return response()->json(['message' => 'You cannot follow yourself'], 400);
        }

        if ($request->user()->isFollowing($userToFollow)) {
            return response()->json(['message' => 'Already following this user'], 400);
        }

        $request->user()->following()->attach($userToFollow->id);

        return response()->json([
            'message' => 'Successfully followed user',
            'is_following' => true
        ]);
    }

    public function unfollow(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required|string|max:50',
        ]);

        $userToUnfollow = User::where('username', $validated['username'])->first();

        if (!$userToUnfollow) {
            return response()->json(['message' => 'User not found'], 404);
        }

        if (!$request->user()->isFollowing($userToUnfollow)) {
            return response()->json(['message' => 'Not following this user'], 400);
        }

        $request->user()->following()->detach($userToUnfollow->id);

        return response()->json([
            'message' => 'Successfully unfollowed user',
            'is_following' => false
        ]);
    }

    public function getFollowers(Request $request, $username)
    {
        $cacheKey = "user_followers_{$username}_requester_" . ($request->user() ? $request->user()->id : 'guest');

        $followers = Cache::remember($cacheKey, now()->addSeconds(1), function () use ($username, $request) {
            $user = User::where('username', $username)->first();

            if (!$user) {
                return null;
            }

            $followers = $user->followers()->select('users.id', 'users.username', 'users.name', 'users.avatar', 'users.bio')->get();

            $currentUser = $request->user();
            $followers->each(function ($follower) use ($currentUser) {
                $follower->is_following = $currentUser ? $currentUser->isFollowing($follower) : false;
            });

            return $followers;
        });

        if (!$followers) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json($followers);
    }

    public function getFollowing(Request $request, $username)
    {
        $cacheKey = "user_following_{$username}_requester_" . ($request->user() ? $request->user()->id : 'guest');

        $following = Cache::remember($cacheKey, now()->addSeconds(1), function () use ($username, $request) {
            $user = User::where('username', $username)->first();

            if (!$user) {
                return null;
            }

            $following = $user->following()->select('users.id', 'users.username', 'users.name', 'users.avatar', 'users.bio')->get();

            $currentUser = $request->user();
            $following->each(function ($followedUser) use ($currentUser) {
                $followedUser->is_following = $currentUser ? $currentUser->isFollowing($followedUser) : false;
            });

            return $following;
        });

        if (!$following) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json($following);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }
}

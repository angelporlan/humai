<?php

namespace App\Services;

use App\Models\User;
use App\Models\Post;

class FeedService
{
    /**
     * Devuelve el feed de posts de un usuario
     * @param User $user
     * @param int $perPage
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getFeed(User $user, int $perPage = 10)
    {
        $followingIds = $user->following()->pluck('users.id')->push($user->id);

        $posts = Post::with(['user', 'comments', 'reactions', 'tags'])
            ->whereIn('user_id', $followingIds)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return $posts;
    }

    public function feed()
    {
        $user = \App\Models\User::first();

        $perPage = 10;

        $posts = (new \App\Services\FeedService())->getFeed($user, $perPage);

        return \App\Http\Resources\PostResource::collection($posts);
    }
}

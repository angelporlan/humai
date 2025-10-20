<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\PostResource;
use App\Models\Post;
use App\Models\User;
use App\Services\FeedService;
use Illuminate\Support\Facades\Log;

class PostController extends Controller
{
    protected $feedService;

    public function __construct(FeedService $feedService)
    {
        $this->feedService = $feedService;
    }

    /**
     * Devuelve el feed del usuario autenticado
     */
    public function feed(Request $request)
    {
        $user = $request->user();
        $perPage = $request->get('per_page', 10);

        $posts = $this->feedService->getFeed($user, $perPage);

        return PostResource::collection($posts);
    }

    public function getPostsOfAUser(Request $request)
    {
        $username = $request->get('username');
        //obtener el usuario por el username
        $user = User::where('username', $username)->first();
        $perPage = $request->get('per_page', 10);

        $posts = Post::with(['user', 'comments', 'reactions', 'tags'])
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return PostResource::collection($posts);
    }
}
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\PostResource;
use App\Models\Post;
use App\Models\Reaction;
use App\Models\User;
use App\Services\FeedService;

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
        $user = User::where('username', $username)->first();
        $perPage = $request->get('per_page', 10);

        $posts = Post::with(['user', 'comments', 'reactions', 'tags'])
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return PostResource::collection($posts);
    }

    public function getPostsReactedOfAUser(Request $request)
    {
        $username = $request->get('username');
        $user = User::where('username', $username)->first();
        $perPage = $request->get('per_page', 10);

        $reactions = Reaction::with(['reactionable' => function ($query) use ($user) {
                $query->where('user_id', $user->id);
            }])
            ->where('user_id', $user->id)
            ->where('reactionable_type', 'App\\Models\\Post')
            ->get(['id', 'reactionable_id', 'reactionable_type', 'type']);

        $postIds = [];
        $reactionData = [];
        
        foreach ($reactions as $reaction) {
            $postIds[] = $reaction->reactionable_id;
            $reactionData[$reaction->reactionable_id] = [
                'reaction_type' => $reaction->type,
                'reactionable_type' => $reaction->reactionable_type
            ];
        }

        $posts = Post::with(['user', 'comments', 'reactions', 'tags'])
            ->whereIn('id', $postIds)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        $posts->getCollection()->transform(function ($post) use ($reactionData) {
            if (isset($reactionData[$post->id])) {
                $post->reaction_type = $reactionData[$post->id]['reaction_type'];
                $post->reactionable_type = $reactionData[$post->id]['reactionable_type'];
            }
            return $post;
        });

        return PostResource::collection($posts);
    }
}
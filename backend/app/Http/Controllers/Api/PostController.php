<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\PostResource;
use App\Models\Post;
use App\Models\Reaction;
use App\Models\User;
use App\Services\FeedService;
use Exception;
use Illuminate\Support\Facades\Log;

class PostController extends Controller
{
    protected $feedService;

    public function __construct(FeedService $feedService)
    {
        $this->feedService = $feedService;
    }

    public function postPost(Request $request)
    {
        $validated = $request->validate([
            'content' => 'required|string|max:5000',
            'is_public' => 'boolean',
            'meta' => 'nullable|array'
        ]);

        try {
            $user = $request->user();
            $post = Post::create([
                'user_id' => $user->id,
                'content' => $validated['content'],
                'is_public' => $validated['is_public'] ?? true,
                'meta' => $validated['meta'] ?? null,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Post created successfully',
                'post' => $post
            ], 201);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating post',
                'error' => $e->getMessage()
            ], 500);
        }
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
        
    /**
     * Reaccionar a un post
     */
    public function reactToAPost(Request $request)
    {
        $user = $request->user();
        $postId = $request->get('post_id');
        $post = Post::find($postId);
        if (!$post) {
            return response()->json([
                'success' => false,
                'message' => 'Post not found'
            ], 404);
        }

        // Check if user has already reacted to this post
        if ($user->hasReactedTo($post)) {
            $post->decrement('likes_count');
            $user->reactions()
                ->where('reactionable_id', $post->id)
                ->where('reactionable_type', 'App\\Models\\Post')
                ->delete();
            return response()->json([
                'success' => true,
                'message' => 'Reaction removed successfully',
                'likes_count' => $post->likes_count
            ], 200);
        }
        
        $reaction = $post->reactions()->create([
            'user_id' => $user->id,
            'type' => $request->get('type'),
            'reactionable_id' => $post->id,
            'reactionable_type' => 'App\\Models\\Post'
        ]);
        $post->increment('likes_count');
        
        return response()->json([
            'success' => true,
            'message' => 'Reaction added successfully',
            'likes_count' => $post->likes_count
        ], 200);
    }
}

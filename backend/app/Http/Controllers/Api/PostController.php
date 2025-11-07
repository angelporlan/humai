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
        $perPage = $request->get('per_page', 10);
        $requestingUser = $request->user();
        
        $posts = $this->feedService->getPostsByUser($requestingUser, $username, $perPage);
        
        if (!$posts) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }
        
        return PostResource::collection($posts);
    }

    public function getPostsReactedOfAUser(Request $request)
    {
        $username = $request->get('username');
        $perPage = $request->get('per_page', 10);
        
        $posts = $this->feedService->getPostsReactedByUser($username, $perPage);
        
        if (!$posts) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }
        
        return PostResource::collection($posts);
    }
        
    /**
     * Reaccionar a un post
     */
    public function reactToAPost(Request $request)
    {
        $user = $request->user();
        $postId = $request->get('post_id');
        $reactionType = $request->get('type', 'like');
        
        $result = $this->feedService->togglePostReaction($user, $postId, $reactionType);
        
        return response()->json(
            collect($result)->except('status'),
            $result['status']
        );
    }
}

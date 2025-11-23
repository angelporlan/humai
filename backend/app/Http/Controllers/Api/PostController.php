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
use Illuminate\Support\Facades\Cache;

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
            'meta' => 'nullable|array',
            'parent_post' => 'nullable|exists:posts,id',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50'
        ]);

        $user = $request->user();
        $result = $this->feedService->createPost($user, $validated);

        return response()->json(
            $result,
            $result['success'] ? 201 : ($result['status'] ?? 500)
        );
    }

    /**
     * Devuelve el feed del usuario autenticado
     */
    public function feed(Request $request)
    {
        $user = $request->user();
        $perPage = $request->get('per_page', 10);
        $page = $request->get('page', 1);

        $cacheKey = "feed_user_{$user->id}_page_{$page}_per_page_{$perPage}";

        $posts = Cache::remember($cacheKey, now()->addSeconds(1), function () use ($user, $perPage) {
            return $this->feedService->getFeed($user, $perPage);
        });

        return PostResource::collection($posts);
    }

    /**
     * Devuelve el feed global para explorar
     */
    public function explore(Request $request)
    {
        $user = $request->user();
        $perPage = $request->get('per_page', 10);
        $page = $request->get('page', 1);

        $cacheKey = "explore_user_{$user->id}_page_{$page}_per_page_{$perPage}";

        $posts = Cache::remember($cacheKey, 60 * 10, function () use ($user, $perPage) {
            return $this->feedService->getGlobalFeed($user, $perPage);
        });

        return PostResource::collection($posts);
    }

    public function getPostsOfAUser(Request $request)
    {
        $username = $request->get('username');
        $perPage = $request->get('per_page', 10);
        $page = $request->get('page', 1);
        $requestingUser = $request->user();
        
        $cacheKey = "user_posts_{$username}_by_{$requestingUser->id}_page_{$page}_per_page_{$perPage}";

        $posts = Cache::remember($cacheKey, now()->addSeconds(1), function () use ($requestingUser, $username, $perPage) {
            return $this->feedService->getPostsByUser($requestingUser, $username, $perPage);
        });
        
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


    /**
     * Obtener comentarios de un usuario
     */
    public function getCommentsOfAUser(Request $request)
    {
        $username = $request->get('username');
        $perPage = $request->get('per_page', 10);
        
        $comments = $this->feedService->getCommentsByUser($username, $perPage);
        
        if (!$comments) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        return PostResource::collection($comments);
    }

    public function getPost(Request $request)
    {
        $postId = $request->get('post_id');
        $user = $request->user();

        $cacheKey = "post_{$postId}_user_{$user->id}";

        $post = Cache::remember($cacheKey, 60 * 10, function () use ($postId, $user) {
            return $this->feedService->getPost($postId, $user);
        });
        
        if (!$post) {
            return response()->json([
                'success' => false,
                'message' => 'Post not found'
            ], 404);
        }
        
        return new PostResource($post);
    }

        /**
     * Obtener comentarios de un post
     */
    public function getCommentsOfAPost(Request $request)
    {
        $postId = $request->get('post_id');
        $username = $request->get('username');
        $perPage = $request->get('per_page', 10);
        
        $comments = $this->feedService->getCommentsByPost($postId, $username, $perPage);

        if (!$comments) {
            return response()->json([
                'success' => false,
                'message' => 'Post not found'
            ], 404);
        }

        return PostResource::collection($comments);
    }
}

<?php

namespace App\Services;

use App\Models\User;
use App\Models\Post;
use App\Models\Reaction;

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

        return $this->addUserReactionInfo($posts, $user->id);
    }

    /**
     * Get posts by a specific user with reaction information
     */
    public function getPostsByUser(User $requestingUser, string $username, int $perPage = 10)
    {
        $user = User::where('username', $username)->first();
        
        if (!$user) {
            return null;
        }

        $posts = Post::with(['user', 'comments', 'reactions', 'tags'])
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return $this->addUserReactionInfo($posts, $requestingUser->id);
    }

    /**
     * Add user reaction information to a collection of posts
     */
    private function addUserReactionInfo($posts, $userId)
    {
        $posts->getCollection()->transform(function ($post) use ($userId) {
            $userReaction = $post->reactions()->where('user_id', $userId)->first();
            $post->user_has_reacted = $userReaction ? true : false;
            $post->user_reaction_type = $userReaction ? $userReaction->type : null;
            return $post;
        });

        return $posts;
    }

    /**
     * Get posts that a specific user has reacted to
     */
    /**
     * Toggle a reaction to a post
     */
    public function togglePostReaction(User $user, int $postId, string $reactionType = 'like')
    {
        $post = Post::find($postId);
        
        if (!$post) {
            return [
                'success' => false,
                'message' => 'Post not found',
                'status' => 404
            ];
        }

        // Check if user has already reacted to this post
        $existingReaction = $user->reactions()
            ->where('reactionable_id', $post->id)
            ->where('reactionable_type', 'App\\Models\\Post')
            ->first();

        if ($existingReaction) {
            // Remove existing reaction
            $post->decrement('likes_count');
            $existingReaction->delete();
            
            return [
                'success' => true,
                'message' => 'Reaction removed successfully',
                'likes_count' => $post->likes_count,
                'user_has_reacted' => false,
                'reaction_type' => null,
                'status' => 200
            ];
        }

        // Add new reaction
        $reaction = $post->reactions()->create([
            'user_id' => $user->id,
            'type' => $reactionType,
            'reactionable_id' => $post->id,
            'reactionable_type' => 'App\\Models\\Post'
        ]);
        
        $post->increment('likes_count');
        
        return [
            'success' => true,
            'message' => 'Reaction added successfully',
            'likes_count' => $post->likes_count,
            'user_has_reacted' => true,
            'reaction_type' => $reactionType,
            'status' => 200
        ];
    }

    /**
     * Get posts that a specific user has reacted to
     */
    public function getPostsReactedByUser(string $username, int $perPage = 10)
    {
        $user = User::where('username', $username)->first();
        
        if (!$user) {
            return null;
        }

        // Get all post IDs and reaction types for the user
        $reactions = Reaction::where('user_id', $user->id)
            ->where('reactionable_type', 'App\\Models\\Post')
            ->get(['reactionable_id', 'type']);

        $postIds = [];
        $reactionTypes = [];

        foreach ($reactions as $reaction) {
            $postIds[] = $reaction->reactionable_id;
            $reactionTypes[$reaction->reactionable_id] = $reaction->type;
        }

        if (empty($postIds)) {
            return new \Illuminate\Pagination\LengthAwarePaginator(
                [], 0, $perPage, 1
            );
        }

        $posts = Post::with(['user', 'comments', 'reactions', 'tags'])
            ->whereIn('id', $postIds)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        // Add reaction information to each post
        $posts->getCollection()->each(function ($post) use ($reactionTypes) {
            if (isset($reactionTypes[$post->id])) {
                $post->reaction_type = $reactionTypes[$post->id];
                $post->user_has_reacted = true;
                $post->user_reaction_type = $reactionTypes[$post->id];
            } else {
                $post->user_has_reacted = false;
                $post->user_reaction_type = null;
            }
        });

        return $posts;
    }
}

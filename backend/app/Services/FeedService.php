<?php

namespace App\Services;

use App\Models\User;
use App\Models\Post;
use App\Models\Reaction;
use App\Models\Comment;
use App\Models\Tag;

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
            ->where('parent_post', null)
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
            ->where('parent_post', null)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return $this->addUserReactionInfo($posts, $requestingUser->id);
    }

    /**
     * Get global feed for explore feature
     */
    public function getGlobalFeed(User $user, int $perPage = 10)
    {
        $posts = Post::with(['user', 'comments', 'reactions', 'tags'])
            ->where('parent_post', null)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return $this->addUserReactionInfo($posts, $user->id);
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
    /**
     * Create a new post or comment
     */
    public function createPost(User $user, array $data)
    {
        try {
            $post = Post::create([
                'user_id' => $user->id,
                'content' => $data['content'],
                'is_public' => $data['is_public'] ?? true,
                'meta' => $data['meta'] ?? null,
                'parent_post' => $data['parent_post'] ?? null,
            ]);

            if (!empty($data['parent_post'])) {
                Post::where('id', $data['parent_post'])->increment('comments_count');
            }

            if (!empty($data['tags'])) {
                $tagIds = [];
                foreach (array_unique($data['tags']) as $tagName) {
                    $tag = Tag::firstOrCreate(
                        ['name' => $tagName],
                        ['posts_count' => 0]
                    );
                    $tag->increment('posts_count');
                    $tagIds[] = $tag->id;
                }
                $post->tags()->attach($tagIds);
            }

            $post->load('user:id,username,avatar');

            $post->comments_count = 0;
            $post->likes_count = 0;

            return [
                'success' => true,
                'message' => !empty($data['parent_post']) ? 'Comment created successfully' : 'Post created successfully',
                'post' => $post
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Error creating post: ' . $e->getMessage(),
                'status' => 500
            ];
        }
    }

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
    /**
     * Get comments made by a specific user
     * 
     * @param string $username Username of the user whose comments to retrieve
     * @param int $perPage Number of items per page
     * @return \Illuminate\Pagination\LengthAwarePaginator|null
     */
    public function getCommentsByUser(string $username, int $perPage = 10)
    {
        $user = User::where('username', $username)->first();

        if (!$user) {
            return null;
        }

        $posts = Post::where('user_id', $user->id)
            ->where('parent_post', '!=', null)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        $posts->getCollection()->transform(function ($post) use ($user) {
            $post->user_has_reacted = false;
            $post->user_reaction_type = null;

            $reaction = $post->reactions()->where('user_id', $user->id)->first();

            if ($reaction) {
                $post->user_has_reacted = true;
                $post->user_reaction_type = $reaction->type;
            }

            $parent = Post::find($post->parent_post);

            $post->parent = $parent;

            $post->parent->user = User::select('username', 'avatar')->find($post->parent->user_id);

            if ($post->parent->reactions()->where('user_id', $user->id)->exists()) {
                $post->parent->user_has_reacted = true;
                $post->parent->user_reaction_type = $post->parent->reactions()->where('user_id', $user->id)->first()->type;
            }

            $post->parent->tags = $post->parent->tags()->get()->pluck('name')->toArray();

            return $post;
        });

        return $posts;
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
                [],
                0,
                $perPage,
                1
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

    public function getPost(int $postId, ?User $user = null)
    {
        $post = Post::with(['user', 'comments', 'reactions', 'tags'])
            ->find($postId);

        if (!$post) {
            return null;
        }

        $post->user_has_reacted = false;
        $post->user_reaction_type = null;

        if ($user) {
            $reaction = $post->reactions()->where('user_id', $user->id)->first();
            
            if ($reaction) {
                $post->user_has_reacted = true;
                $post->user_reaction_type = $reaction->type;
            }
        }

        return $post;
    }

    /**
     * Get paginated comments for a specific post
     *
     * @param int $postId
     * @param int $perPage
     * @return \Illuminate\Pagination\LengthAwarePaginator|null
     */
    public function getCommentsByPost(int $postId, string $username, int $perPage = 10)
    {
        $posts = Post::where('parent_post', $postId)
            ->with(['user', 'reactions', 'tags'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        $requestingUser = User::where('username', $username)->first();

        // get user_reaction_type and user_has_reacted

        $posts->getCollection()->transform(function ($post) use ($requestingUser) {
            $post->user_has_reacted = false;
            $post->user_reaction_type = null;

            $reaction = $post->reactions()->where('user_id', $requestingUser->id)->first();

            if ($reaction) {
                $post->user_has_reacted = true;
                $post->user_reaction_type = $reaction->type;
            }

            return $post;
        });

        return $posts;
    }
}

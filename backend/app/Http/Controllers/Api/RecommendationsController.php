<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Tag;
use App\Models\Post;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class RecommendationsController extends Controller
{
    /**
     * Get suggested users to follow
     * Algorithm: 
     * 1. Get users followed by people the current user follows (second-degree connections)
     * 2. Exclude users already followed by current user
     * 3. Order by follower count (popularity)
     * 4. Limit to 3 results
     */
    public function getSuggestedUsers(Request $request)
    {
        $user = $request->user();
        
        $cacheKey = "user_suggestions_{$user->id}";
        
        $suggestions = Cache::remember($cacheKey, 60 * 30, function () use ($user) {
            $followingIds = $user->following()->pluck('users.id')->toArray();
            $followingIds[] = $user->id;
            
            $suggestedUsers = User::select('users.id', 'users.username', 'users.name', 'users.avatar', 'users.bio')
                ->selectRaw('COUNT(DISTINCT follows.follower_id) as mutual_followers')
                ->join('follows', 'users.id', '=', 'follows.followee_id')
                ->whereIn('follows.follower_id', $followingIds)
                ->whereNotIn('users.id', $followingIds)
                ->groupBy('users.id', 'users.username', 'users.name', 'users.avatar', 'users.bio')
                ->withCount('followers')
                ->orderByDesc('mutual_followers')
                ->orderByDesc('followers_count')
                ->limit(3)
                ->get();
            
            if ($suggestedUsers->count() < 3) {
                $limit = 3 - $suggestedUsers->count();
                $popularUsers = User::whereNotIn('id', $followingIds)
                    ->whereNotIn('id', $suggestedUsers->pluck('id'))
                    ->withCount('followers')
                    ->orderByDesc('followers_count')
                    ->limit($limit)
                    ->get(['id', 'username', 'name', 'avatar', 'bio']);
                
                $suggestedUsers = $suggestedUsers->concat($popularUsers);
            }
            
            return $suggestedUsers->map(function ($user) {
                return [
                    'id' => $user->id,
                    'username' => $user->username,
                    'name' => $user->name,
                    'avatar' => $user->avatar,
                    'bio' => $user->bio,
                    'followers_count' => $user->followers_count ?? 0,
                    'mutual_followers' => $user->mutual_followers ?? 0,
                    'is_following' => $user->isFollowing($user)
                ];
            });
        });
        
        return response()->json([
            'suggestions' => $suggestions
        ]);
    }
    
    /**
     * Get trending topics based on hashtags
     * Algorithm:
     * 1. Get tags with posts from the last 7 days
     * 2. Calculate trend score based on recent activity
     * 3. Order by trend score
     * 4. Limit to 3 results
     */
    public function getTrendingTopics(Request $request)
    {
        $cacheKey = "trending_topics";
        
        $trends = Cache::remember($cacheKey, now()->addSeconds(1), function () {
            $thirtyDaysAgo = now()->subDays(90);
            
            $trendingTags = Tag::select('tags.id', 'tags.name', 'tags.posts_count', 'tags.created_at', 'tags.updated_at')
                ->selectRaw('COUNT(post_tag.post_id) as recent_posts_count')
                ->join('post_tag', 'tags.id', '=', 'post_tag.tag_id')
                ->join('posts', 'post_tag.post_id', '=', 'posts.id')
                ->where('posts.created_at', '>=', $thirtyDaysAgo)
                ->where('posts.is_public', true)
                ->groupBy('tags.id', 'tags.name', 'tags.posts_count', 'tags.created_at', 'tags.updated_at')
                ->having('recent_posts_count', '>', 0)
                ->get();
            
            return $trendingTags->map(function ($tag) {
                // $trendScore = ($tag->posts_count * .7) + ($tag->recent_posts_count * .3);
                $trendScore = ($tag->posts_count * 1) + ($tag->recent_posts_count * 0);
                
                return [
                    'id' => $tag->id,
                    'name' => $tag->name,
                    'posts_count' => $tag->posts_count,
                    'recent_posts_count' => $tag->recent_posts_count,
                    'trend_score' => round($trendScore, 2)
                ];
            })->sortBy([
                ['trend_score', 'desc'],
                ['posts_count', 'desc']
            ])->take(3)->values();
        });
        
        return response()->json([
            'trends' => $trends
        ]);
    }
}

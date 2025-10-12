<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'content', 'is_public', 'meta', 'likes_count', 'comments_count'
    ];

    protected $casts = [
        'is_public' => 'boolean',
        'meta' => 'array',
        'likes_count' => 'integer',
        'comments_count' => 'integer',
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function comments() {
        return $this->hasMany(Comment::class);
    }

    public function reactions() {
        return $this->morphMany(Reaction::class, 'reactionable');
    }

    public function bookmarks() {
        return $this->hasMany(Bookmark::class);
    }

    public function tags() {
        return $this->belongsToMany(Tag::class, 'post_tag')->withTimestamps();
    }

    public function scopePublic($query) {
        return $query->where('is_public', true);
    }

    public function scopeFeed($query, $user) {
        $followingIds = $user->following()->pluck('users.id')->push($user->id);
        return $query->whereIn('user_id', $followingIds)->orderBy('created_at', 'desc');
    }
}

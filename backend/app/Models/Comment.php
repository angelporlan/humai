<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = ['post_id', 'user_id', 'parent_id', 'content', 'likes_count'];

    protected $casts = [
        'likes_count' => 'integer',
    ];

    public function post() {
        return $this->belongsTo(Post::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function parent() {
        return $this->belongsTo(Comment::class, 'parent_id');
    }

    public function children() {
        return $this->hasMany(Comment::class, 'parent_id');
    }

    public function reactions() {
        return $this->morphMany(Reaction::class, 'reactionable');
    }
}

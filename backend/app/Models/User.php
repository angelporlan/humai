<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'username', 'email', 'password', 'name', 'avatar', 'bio', 'settings'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'settings' => 'array',
        ];
    }


    public function posts() {
        return $this->hasMany(Post::class);
    }

    public function comments() {
        return $this->hasMany(Comment::class);
    }

    public function reactions() {
        return $this->hasMany(Reaction::class);
    }

    public function bookmarks() {
        return $this->hasMany(Bookmark::class);
    }

    public function followers() {
        return $this->belongsToMany(User::class, 'follows', 'followee_id', 'follower_id')->withTimestamps();
    }

    public function following() {
        return $this->belongsToMany(User::class, 'follows', 'follower_id', 'followee_id')->withTimestamps();
    }

    public function notifications() {
        return $this->hasMany(Notification::class);
    }

    // SCOPES
    public function scopeActive($query) {
        return $query->whereNotNull('email_verified_at');
    }

    /**
     * Check if the user has reacted to a specific post
     *
     * @param \App\Models\Post $post
     * @return bool
     */
    public function hasReactedTo(Post $post): bool
    {
        return $this->reactions()
            ->where('reactionable_id', $post->id)
            ->where('reactionable_type', 'App\\Models\\Post')
            ->exists();
    }
}

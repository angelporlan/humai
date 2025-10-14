<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'content' => $this->content,
            'user' => [
                'id' => $this->user->id,
                'username' => $this->user->username,
                'avatar' => $this->user->avatar,
            ],
            'comments_count' => $this->comments_count,
            'likes_count' => $this->likes_count,
            'tags' => $this->tags->pluck('name'),
            'created_at' => $this->created_at->toDateTimeString(),
        ];
    }
}

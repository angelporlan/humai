<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CommentResource extends JsonResource
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
            'created_at' => $this->created_at,
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'username' => $this->user->username,
                'avatar' => $this->user->avatar ?? null,
            ],
            'post' => [
                'id' => $this->post->id,
                'content' => $this->post->content,
                'comments_count' => $this->post->comments_count,
                'likes_count' => $this->post->likes_count,
                'user' => [
                    'id' => $this->post->user->id,
                    'name' => $this->post->user->name,
                    'username' => $this->post->user->username,
                    'avatar' => $this->post->user->avatar ?? null,
                ]
            ]
        ];
    }
}

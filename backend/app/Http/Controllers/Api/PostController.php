<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\PostResource;
use App\Services\FeedService;

class PostController extends Controller
{
    protected $feedService;

    public function __construct(FeedService $feedService)
    {
        $this->feedService = $feedService;
    }

    /**
     * Devuelve el feed del usuario autenticado
     */
    public function feed(Request $request)
    {
        $user = $request->user();
        $perPage = $request->get('per_page', 10);

        $posts = $this->feedService->getFeed($user, $perPage);
        // $posts = $this->feedService->feed($user, $perPage);

        return PostResource::collection($posts);
    }
}
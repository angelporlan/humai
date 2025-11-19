<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\AiService;

class AiContentController extends Controller
{
    public function index(Request $request)
    {

        if ($request->input('message') === null) {
            return response()->json([
                'error' => 'Missing required parameter: message',
            ], 400);
        }

        $validated = $request->validate([
            'message' => 'required|string|max:5000',
        ]);

        $validated['message'] = $validated['message'];

        $request = new Request($validated);

        $aiService = new AiService();
        $response = $aiService->index($request);
        return response()->json([
            'message' => $response
        ]);
    }
}

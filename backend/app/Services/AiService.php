<?php

namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Client\Response;
use Throwable;


class AiService
{
    private string $apiKey;
    private string $model;
    private string $baseUrl;
    private string $aiSystemPrompt;

    public function __construct()
    {
        $this->apiKey = env('OPENAI_API_KEY');
        $this->model = env('OPENAI_MODEL');
        $this->baseUrl = env('OPENAI_BASE_URL');
        $this->aiSystemPrompt = env('AI_SYSTEM_PROMPT');
    }

    public function index(Request $request): JsonResponse
    {
        if (!$this->apiKey || !$this->model || !$this->baseUrl) {
            return response()->json([
                'error' => 'Missing required environment variables. Please set OPENAI_API_KEY, OPENAI_MODEL, and OPENAI_BASE_URL.'
            ], 500);
        }

        try {
            $response = $this->callOpenAI($request->input('message', $request->message));

            if ($response->failed()) {
                return $this->handleUpstreamError($response);
            }

            $message = $this->extractMessage($response->json());

            if ($message === null) {
                return $this->handleUnexpectedResponse($response->json());
            }

            return response()->json([
                'message' => $message,
            ]);
        } catch (Throwable $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Calls the OpenAI API with a given message.
     */
private function callOpenAI(string $message): Response
    {
        return Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->apiKey,
            'Content-Type' => 'application/json',
        ])->post($this->baseUrl . '/v1/chat/completions', [
            'model' => $this->model,
            'messages' => [
                [
                    'role' => 'system',
                    'content' => $this->aiSystemPrompt,
                ],
                [
                    'role' => 'user',
                    'content' => $message,
                ],
            ],
        ]);
    }
    
    /**
     * Handles the case where the upstream API request fails.
     */
    private function handleUpstreamError(Response $response): JsonResponse
    {
        return response()->json([
            'error' => 'Upstream request failed',
            'status' => $response->status(),
            'body' => $response->json() ?? $response->body(),
        ], 502);
    }

    /**
     * Extracts the message from the API response.
     */
    private function extractMessage(array $data): mixed
    {
        $content = $data['choices'][0]['message']['content'] ?? null;

        // Si viene como JSON en string, intenta parsearlo
        if (is_string($content)) {
            $decoded = json_decode($content, true);
            if (json_last_error() === JSON_ERROR_NONE) {
                return $decoded;
            }
        }

        return $content;
    }

    /**
     * Handles the case of an unexpected response format.
     */
    private function handleUnexpectedResponse(array $data): JsonResponse
    {
        return response()->json([
            'error' => 'Unexpected response format from model provider',
            'example_expected' => [
                'choices' => [
                    ['message' => ['content' => '...']]
                ]
            ],
            'received' => $data,
        ], 500);
    }

    /**
     * Handles general exceptions.
     */
    private function handleException(Throwable $e): JsonResponse
    {
        return response()->json([
            'error' => 'Exception while calling the model provider',
            'message' => $e->getMessage(),
        ], 500);
    }
}

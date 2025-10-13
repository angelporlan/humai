<?php

namespace Database\Factories;

use App\Models\Post;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Post>
 */
class PostFactory extends Factory
{

    protected $model = \App\Models\Post::class;


    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' =>  \App\Models\User::factory(), // crea usuario automáticamente si no existe
            'content' => $this->faker->paragraphs(1, true),
            'is_public' => true,
            'likes_count' => 0,
            'comments_count' => 0,
            'meta' => ['mood' => $this->faker->word],
            'created_at' => $this->faker->dateTimeBetween('-6 months', 'now'),
            'updated_at' => now(),
        ];
    }
}

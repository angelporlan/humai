<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Reaction>
 */
class ReactionFactory extends Factory
{
    protected $model = \App\Models\Reaction::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $types = ['like','love','haha','wow','sad','angry', 'beer', 'celebrate'];

        return [
            'user_id' => \App\Models\User::factory(),
            'reactionable_id' => \App\Models\Post::factory(),
            'reactionable_type' => \App\Models\Post::class,
            'type' => $this->faker->randomElement($types),
            'created_at' => $this->faker->dateTimeBetween('-6 months', 'now'),
            'updated_at' => now(),
        ];
    }
}

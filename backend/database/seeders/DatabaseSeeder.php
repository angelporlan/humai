<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Post;
use App\Models\Comment;
use App\Models\Reaction;
use App\Models\Bookmark;
use App\Models\Tag;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 50 usuarios
        $users = User::factory(50)->create();

        // Cada usuario 50 posts
        $users->each(function($user) {
            $posts = Post::factory(50)->create(['user_id' => $user->id]);

            // Cada post 10 comentarios aleatorios
            $posts->each(function($post) use ($user) {
                Comment::factory(10)->create([
                    'post_id' => $post->id,
                    'user_id' => User::inRandomOrder()->first()->id
                ]);
                
                // Cada post 5 reacciones aleatorias
                $usersForReactions = User::inRandomOrder()->take(5)->pluck('id');

                foreach ($usersForReactions as $uid) {
                    Reaction::factory()->create([
                        'reactionable_id' => $post->id,
                        'reactionable_type' => \App\Models\Post::class,
                        'user_id' => $uid,
                    ]);
                }

                // Cada post 2 bookmarks aleatorios
                $usersForBookmarks = User::inRandomOrder()->take(2)->pluck('id');

                foreach ($usersForBookmarks as $uid) {
                    Bookmark::factory()->create([
                        'post_id' => $post->id,
                        'user_id' => $uid,
                    ]);
                }
            });
        });

        // Follows aleatorios
        $users->each(function($user) use ($users) {
            $followees = $users->where('id','!=',$user->id)->random(10);
            foreach ($followees as $followee) {
                $user->following()->attach($followee->id);
            }
        });

        // Tags aleatorios
        $tags = Tag::factory(30)->create();
        Post::all()->each(function($post) use ($tags) {
            $post->tags()->attach($tags->random(3)->pluck('id'));
        });
    }
}

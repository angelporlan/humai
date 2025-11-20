<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_private')->default(false)->after('bio');
            $table->enum('allow_comments_from', ['everyone', 'followers', 'none'])->default('everyone')->after('is_private');
            $table->boolean('email_notifications')->default(true)->after('allow_comments_from');
            $table->boolean('push_notifications')->default(true)->after('email_notifications');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['is_private', 'allow_comments_from', 'email_notifications', 'push_notifications']);
        });
    }
};

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\User;

class SettingsController extends Controller
{
    /**
     * Get all settings for the authenticated user
     */
    public function getSettings(Request $request)
    {
        $user = $request->user();
        $settings = $user->settings ?? [];
        
        return response()->json([
            'profile' => [
                'name' => $user->name,
                'bio' => $user->bio,
                'avatar' => $user->avatar,
            ],
            'privacy' => [
                'is_private' => $settings['is_private'] ?? false,
                'allow_comments_from' => $settings['allow_comments_from'] ?? 'everyone',
            ],
            'notifications' => [
                'email_notifications' => $settings['email_notifications'] ?? true,
                'push_notifications' => $settings['push_notifications'] ?? true,
            ]
        ]);
    }

    /**
     * Update user profile
     */
    public function updateProfile(Request $request)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'bio' => 'sometimes|nullable|string|max:500',
            'avatar' => 'sometimes|string|max:255',
        ]);

        $user = $request->user();
        $user->update($validated);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    }

    /**
     * Update privacy settings
     */
    public function updatePrivacySettings(Request $request)
    {
        $validated = $request->validate([
            'is_private' => 'sometimes|boolean',
            'allow_comments_from' => 'sometimes|in:everyone,followers,none',
        ]);

        $user = $request->user();
        $settings = $user->settings ?? [];
        
        // Update settings JSON
        foreach ($validated as $key => $value) {
            $settings[$key] = $value;
        }
        
        $user->update(['settings' => $settings]);

        return response()->json([
            'message' => 'Privacy settings updated successfully',
            'privacy' => [
                'is_private' => $settings['is_private'] ?? false,
                'allow_comments_from' => $settings['allow_comments_from'] ?? 'everyone',
            ]
        ]);
    }

    /**
     * Update notification settings
     */
    public function updateNotificationSettings(Request $request)
    {
        $validated = $request->validate([
            'email_notifications' => 'sometimes|boolean',
            'push_notifications' => 'sometimes|boolean',
        ]);

        $user = $request->user();
        $settings = $user->settings ?? [];
        
        // Update settings JSON
        foreach ($validated as $key => $value) {
            $settings[$key] = $value;
        }
        
        $user->update(['settings' => $settings]);

        return response()->json([
            'message' => 'Notification settings updated successfully',
            'notifications' => [
                'email_notifications' => $settings['email_notifications'] ?? true,
                'push_notifications' => $settings['push_notifications'] ?? true,
            ]
        ]);
    }

    /**
     * Change user password
     */
    public function changePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:6|confirmed',
        ]);

        $user = $request->user();

        // Verify current password
        if (!Hash::check($validated['current_password'], $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['The current password is incorrect.'],
            ]);
        }

        // Update password
        $user->update([
            'password' => Hash::make($validated['new_password'])
        ]);

        // Revoke all tokens to force re-login
        $user->tokens()->delete();

        return response()->json([
            'message' => 'Password changed successfully. Please log in again.'
        ]);
    }

    /**
     * Delete user account (soft delete)
     */
    public function deleteAccount(Request $request)
    {
        $validated = $request->validate([
            'password' => 'required|string',
        ]);

        $user = $request->user();

        // Verify password
        if (!Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'password' => ['The password is incorrect.'],
            ]);
        }

        // Delete all tokens
        $user->tokens()->delete();

        // Soft delete the user
        $user->delete();

        return response()->json([
            'message' => 'Account deleted successfully'
        ]);
    }
}

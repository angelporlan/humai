<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Models\Notification;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $userId = Auth::id();
        $notifications = Notification::where(function ($query) use ($userId) {
            $query->where('user_id', $userId)
                ->orWhere('user_id', 0);
        })->orderBy('created_at', 'desc')->paginate(20);

        return response()->json($notifications);
    }

    public function markAsRead($id)
    {
        $notification = Notification::where('id', $id)
            ->where(function ($query) {
                $query->where('user_id', Auth::id())
                    ->orWhere('user_id', 0);
            })->firstOrFail();

        if ($notification->user_id == Auth::id()) {
            $notification->update(['read' => true]);
        }

        return response()->json(['message' => 'Notification marked as read']);
    }

    public function markAllAsRead()
    {
        Notification::where('user_id', Auth::id())
            ->where('read', false)
            ->update(['read' => true]);

        return response()->json(['message' => 'All notifications marked as read']);
    }
}

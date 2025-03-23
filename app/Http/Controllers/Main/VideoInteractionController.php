<?php

namespace App\Http\Controllers\Main;

use App\Models\View;
use App\Models\Video;
use App\Models\Comment;
use App\Models\Interaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;

class VideoInteractionController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }
    public function addComment(Request $request)
    {
        $request->validate([
            'video_id' => 'required|integer|exists:videos,id',
            'comment' => 'required|string',
            'reply' => 'nullable|exists:comments,id',
        ]);

        $res = Comment::create([
            'video_id' => $request->video_id,
            'user_id' => Auth::user()->id,
            'comment' => $request->comment,
            'parent_id' => $request->reply ?? null,
        ]);

        $video = Video::with([
            'comments' => function ($query) {
                $query->with('replies');
                $query->where('parent_id', null);
            },
            'user:avatar,name,id',
            'category',
        ])->where('id', $request->video_id)->first();

        return response(['status' => $res ? 'success' : 'error', 'comments' => $video->comments ?? []]);
    }
    public function deleteComment(Request $request)
    {
        $request->validate([
            'comment_id' => 'required|integer|exists:comments,id',
        ]);
        $res = Comment::where('id', $request->comment_id)->where('user_id', Auth::user()->id)->delete();
        return response(['status' => $res ? 'success' : 'error']);
    }
    public function interaction(Request $request)
    {
        $request->validate([
            'interaction' => 'required|in:like,dislike',
            'video_id' => 'required|integer|exists:videos,id',
        ]);

        $res = Interaction::updateOrCreate([
            'user_id' => Auth::user()->id,
            'video_id' => $request->video_id,
        ], [
            'is_liked' => $request->interaction == 'like' ? true : false
        ]);
        
        return response(['status' => $res ? 'success' : 'error']);
    }
}

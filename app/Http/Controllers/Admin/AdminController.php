<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Comment;
use App\Models\User;
use App\Models\Video;
use App\Models\View;
use App\Models\Interaction;
use Carbon\Carbon;

class AdminController extends Controller
{
    public function getStats()
    {
        $stats = [];
        $now = Carbon::now();
        $lastMonth = Carbon::now()->subMonth();

        // Basic stats with month-over-month comparison
        $currentMonthUsers = User::whereMonth('created_at', $now->month)->count();
        $lastMonthUsers = User::whereMonth('created_at', $lastMonth->month)->count();
        $stats['users'] = [
            'total' => User::count(),
            'change' => $lastMonthUsers > 0 ? round(($currentMonthUsers - $lastMonthUsers) / $lastMonthUsers * 100, 1) : 0
        ];

        $currentMonthViews = View::whereMonth('created_at', $now->month)->count();
        $lastMonthViews = View::whereMonth('created_at', $lastMonth->month)->count();
        $stats['views'] = [
            'total' => View::count(),
            'change' => $lastMonthViews > 0 ? round(($currentMonthViews - $lastMonthViews) / $lastMonthViews * 100, 1) : 0
        ];

        $currentMonthComments = Comment::whereMonth('created_at', $now->month)->count();
        $lastMonthComments = Comment::whereMonth('created_at', $lastMonth->month)->count();
        $stats['comments'] = [
            'total' => Comment::count(),
            'change' => $lastMonthComments > 0 ? round(($currentMonthComments - $lastMonthComments) / $lastMonthComments * 100, 1) : 0
        ];

        // Videos stats
        $stats['videos'] = [
            'total' => Video::count(),
            'new' => Video::whereBetween('created_at', [
                Carbon::now()->subDays(7),
                Carbon::now(),
            ])->count()
        ];

        // Monthly engagement data (last 6 months)
        $stats['monthlyEngagement'] = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $monthData = [
                'month' => $date->format('M'),
                'views' => View::whereMonth('created_at', $date->month)
                    ->whereYear('created_at', $date->year)
                    ->count(),
                'likes' => Interaction::whereMonth('created_at', $date->month)
                    ->whereYear('created_at', $date->year)
                    ->where('is_liked', true)
                    ->count(),
                'comments' => Comment::whereMonth('created_at', $date->month)
                    ->whereYear('created_at', $date->year)
                    ->count()
            ];
            $stats['monthlyEngagement'][] = $monthData;
        }

        // Category performance
        $stats['categories'] = Category::withCount('videos')
            ->withCount([
                'videos as views_count' => function ($query) {
                    $query->join('views', 'videos.id', '=', 'views.video_id');
                }
            ])
            ->orderBy('views_count', 'desc')
            ->take(5)
            ->get()
            ->map(function ($category) use ($stats) {
                return [
                    'name' => $category->title,
                    'percentage' => round(($category->videos_count / Video::count()) * 100, 1)
                ];
            });

        // Interaction rates
        $totalVideos = Video::count();
        if ($totalVideos > 0) {
            $stats['interactionRates'] = [
                'likes' => round((Interaction::where('is_liked', true)->count() / $totalVideos) * 100, 1),
                'comments' => round((Comment::count() / $totalVideos) * 100, 1),
                'views' => round((View::count() / $totalVideos) * 100, 1)
            ];
        }

        // Recent activity
        $stats['recentActivity'] = [];

        // Recent comments
        $recentComments = Comment::with(['user', 'video'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($comment) {
                return [
                    'type' => 'comment',
                    'user' => [
                        'name' => $comment->user->name,
                        'avatar' => $comment->user->avatar
                    ],
                    'video_title' => $comment->video->title ?? null,
                    'created_at' => $comment->created_at
                ];
            });

        $stats['recentActivity'] = $recentComments;

        return response($stats);
    }
}
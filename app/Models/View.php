<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class View extends Model
{
    use HasFactory;

    protected $fillable = ['video_id', 'user_id', 'ip'];

    public function setView($video, $ip)
    {

        $view = View::where('video_id', $video);
        if (Auth::user()) {
            if ($view->where('user_id', Auth::user()->id)->first()) {
                return response(['message' => 'Already Viewed']);
            }

        } else {
            if ($view->where('ip', $ip)->first()) {
                return response(['message' => 'Already Viewed']);
            }

        }

        $viewQr = [
            'ip' => $ip,
            'video_id' => $video,
        ];

        if (Auth::user()) {
            $viewQr['user_id'] = Auth::user()->id;
        }

        View::create($viewQr);
    }

    public static function getViewsForPeriod($video, $period)
    {
        $endDate = Carbon::now();

        switch ($period) {
            case 'thisWeek':
                $startDate = $endDate->copy()->startOfWeek();
                break;
            case 'lastWeek':
                $startDate = $endDate->copy()->subWeek()->startOfWeek();
                $endDate = $startDate->copy()->endOfWeek();
                break;
            case 'thisMonth':
                $startDate = $endDate->copy()->startOfMonth();
                break;
            case 'lastMonth':
                $startDate = $endDate->copy()->subMonth()->startOfMonth();
                $endDate = $startDate->copy()->endOfMonth();
                break;
            case 'last3Months':
                $startDate = $endDate->copy()->subMonths(3)->startOfMonth();
                break;
            case 'last6Months':
                $startDate = $endDate->copy()->subMonths(6)->startOfMonth();
                break;
            default:
                $startDate = $endDate->copy()->startOfWeek();
        }

        $views = View::where('video_id', $video)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return [
            'labels' => $views->pluck('date'),
            'data' => $views->pluck('count'),
        ];
    }
}

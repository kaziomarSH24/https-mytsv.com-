<?php

namespace App\Models;

use Http;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Location extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['name'];

    public static function location($ip)
    {
        $response = Http::get("http://ip-api.com/json/{$ip}")->json();
        // return $response;
        if ($response['status'] == 'success') {
            $location = Location::where('title', 'like', $response['city'])->first();
            if (!$location) {
                $location = Location::where('title', 'like', $response['regionName'])->first();
                if (!$location) {
                    return null;
                }
                return ['state' => $location->title, 'city' => $location->title];
            }

            return [
                'state' => optional($location->parent)->title ?? $location->title,
                'city' => $location->title,
            ];
        }

        return null;
    }

    public function parent()
    {
        return $this->belongsTo(Location::class, 'parent_id');
    }

    public function videos()
    {
        return $this->belongsToMany(Video::class, 'video_tag');
    }
}

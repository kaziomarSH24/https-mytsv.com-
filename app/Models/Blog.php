<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

class Blog extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'title', 'slug', 'thumbnail', 'description', 'body'];

    protected $appends = ['user'];

    public function generateImage($image, $slug)
    {
        $manager = new ImageManager(new Driver());

        $sizes = [
            'default' => [1280, 720],
            'tablet' => [640, 360],
            'mobile' => [320, 180],
        ];

        $folder = 'blogs/' . $slug;
        $image->storeAs($folder, 'original.webp', 'public');

        $generatedImages = [];
        foreach ($sizes as $key => $dimensions) {
            $img = $manager->read($image);
            $img->cover($dimensions[0], $dimensions[1]);
            $path = "{$folder}/{$key}.webp";
            $img->toWebp()->save("storage/{$path}");
            $generatedImages[$key] = $path;
        }

        return $generatedImages;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getThumbnailAttribute($value){
        return json_decode($value);
    }

    public function getUserAttribute($value){
        return $this->user()->first(['id', 'name']);
    }

    public function getCreatedAtAttribute($value){
        return Carbon::parse($value)->format('d F, Y');
    }
}

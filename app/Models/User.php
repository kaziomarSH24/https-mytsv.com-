<?php

namespace App\Models;

use App\Models\Review;
use Illuminate\Support\Str;
use Laravel\Cashier\Billable;
use Laravel\Sanctum\HasApiTokens;
use Intervention\Image\ImageManager;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Notifications\Notifiable;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Facades\Storage;

class User extends Authenticatable implements MustVerifyEmail, JWTSubject
{
    use Billable, HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'full_name',
        'email',
        'avatar',
        'additional_info',
        'phone_number',
        'role_id',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'deleted_at',
        'updated_at',
        'created_at',
        'remember_token',
        'email_verified_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

    public $appends = ['rating', 'likes', 'videos', 'views'];

    public function generateAvatar($image)
    {
        $manager = new ImageManager(new Driver());

        $sizes = [
            'default' => [500, 500],
            'tablet' => [300, 300],
            'mobile' => [100, 100],
        ];

        $folder = 'avatars/' . Str::slug($this->name . $this->id);
        $timestamp = time();
        $publicPath = public_path("storage/{$folder}");
        if (!file_exists($publicPath)) {
            mkdir($publicPath, 0755, true);
        }
        $image->storeAs($folder, "original-{$timestamp}.webp", 'public');

        $generatedImages = [];
        foreach ($sizes as $key => $dimensions) {
            $img = $manager->read($image);
            $img->cover($dimensions[0], $dimensions[1]);
            $filename = "{$key}-{$timestamp}.webp";
            $path = "{$folder}/{$filename}";
            $img->toWebp()->save("storage/{$path}");
            $generatedImages[$key] = $path;
        }

        return $generatedImages;
    }

    public function videos()
    {
        return $this->hasMany(Video::class);
    }

    public function getAdditionalInfoAttribute($value)
    {
        return json_decode($value);
    }
    public function getAvatarAttribute($value)
    {
        if ($value == null) {
            return [
                'default' => "https://ui-avatars.com/api/?background=random&name={$this->name}&bold=true",
                'tablet' => "https://ui-avatars.com/api/?background=random&name={$this->name}&bold=true",
                'mobile' => "https://ui-avatars.com/api/?background=random&name={$this->name}&bold=true"
            ];
        }
        return json_decode($value);
    }
    public function getLikesAttribute($value)
    {
        $videoIds = $this->videos()->pluck('id');
        return Interaction::whereIn('video_id', $videoIds)->sum('is_liked');
    }
    public function getVideosAttribute($value)
    {
        return $this->videos()->count();
    }
    public function getViewsAttribute($value)
    {
        return $this->videos()->withCount('views')->get()->sum('views_count');
    }
    public function reviews()
    {
        return $this->hasMany(Review::class, 'user_id');
    }
    public function getRatingAttribute($rating)
    {
        return number_format($this->reviews()->avg('rating'), 1);
    }
}

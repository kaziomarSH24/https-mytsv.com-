<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['title'];
    protected $hidden = ['deleted_at', 'updated_at'];

    public function videos()
    {
        return $this->hasMany(Video::class);
    }
}

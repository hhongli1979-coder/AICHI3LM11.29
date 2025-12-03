<?php

namespace App\Models;

use Exception;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Plugin extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'plugins';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'slug',
        'status',
        'thumbnail_url',
        'version',
        'description',
    ];

    /**
     * @return HasMany
     */
    public function menuItems(): HasMany
    {
        return $this->hasMany(MenuItems::class, 'module');
    }

    public static function isSlugExists($slug)
    {
        try {

            return self::where('slug', $slug)->whereNull('deleted_at')?->first();

        } catch (Exception $e) {
            //
        }
    }
}


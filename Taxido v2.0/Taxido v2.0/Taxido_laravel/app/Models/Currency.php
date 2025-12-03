<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Currency extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The currencies that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'code',
        'status',
        'flag',
        'symbol',
        'no_of_decimal',
        'exchange_rate',
        'created_by_id',
        'system_reserve',
    ];

    protected $casts = [
        'no_of_decimal'  => 'integer',
        'status'         => 'integer',
        'system_reserve' => 'integer',
    ];

    protected $hidden = [
        'created_by_id',
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    public static function boot()
    {
        parent::boot();
        static::saving(function ($model) {
            $model->created_by_id = getCurrentUserId() ?? getAdmin()?->id;
        });
    }

    public function getFlagAttribute($value)
    {
        return $value;
    }

    public function getFlagPathAttribute()
    {
        return $this->attributes['flag'] ? asset('/images/flags/' . $this->attributes['flag']) : null;
    }
}

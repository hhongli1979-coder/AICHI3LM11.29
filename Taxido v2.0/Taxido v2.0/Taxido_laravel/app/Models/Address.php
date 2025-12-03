<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Address extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The Addresses that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'title',
        'is_primary',
        'address',
        'street_address',
        'area_locality',
        'postal_code',
        'city',
        'country_id',
        'state',
        'longitude',
        'latitude',
        'status',
    ];

    protected $casts = [
        'status' => 'integer',
        'country_id' => 'integer',
        'user_id' => 'integer',
    ];

    protected $with = [
        'country:id,name,currency_symbol',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at '
    ];

    /**
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * @return BelongsTo
     */
    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class, 'country_id');
    }
}

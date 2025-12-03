<?php

namespace Modules\Taxido\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class RiderWallet extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The Attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'rider_id',
        'balance'
    ];

    protected $casts = [
        'rider_id' => 'integer',
        'balance' => 'float',
    ];

    protected $with = [
        'histories',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    /**
     * @return HasMany
     */
    public function histories(): HasMany
    {
        return $this->hasMany(RiderWalletHistory::class, 'rider_wallet_id')->orderBy('created_at','desc');
    }
}

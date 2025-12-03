<?php

namespace Modules\Taxido\Models;

use Spatie\Activitylog\LogOptions;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class FleetManagerWallet extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The Attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'fleet_manager_id',
        'balance'
    ];

    protected $with = [
        'histories',
    ];

    protected $casts = [
        'fleet_manager_id' => 'integer',
        'balance' => 'float',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->useLogName('FleetManager')
            ->setDescriptionForEvent(fn(string $eventName) => "{$this->rider_id} - Fleet Manager Wallet has been {$eventName}");
    }

    /**
     * @return HasMany
     */
    public function histories(): HasMany
    {
        return $this->hasMany(FleetWalletHistory::class, 'fleet_wallet_id')->orderBy('created_at','desc');
    }
}
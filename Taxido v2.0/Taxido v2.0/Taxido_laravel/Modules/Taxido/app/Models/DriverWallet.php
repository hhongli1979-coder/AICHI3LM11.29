<?php

namespace Modules\Taxido\Models;

use Spatie\Activitylog\LogOptions;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DriverWallet extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The Attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'driver_id',
        'balance',
    ];

    protected $with = [
        'histories',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    protected $casts = [
        'driver_id' => 'integer',
        'balance' => 'float',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->useLogName('DriverWallet')
            ->setDescriptionForEvent(fn(string $eventName) => "{$this->driver_id} - Driver Wallet has been {$eventName}");
    }

    /**
     * @return HasMany
     */
    public function histories(): HasMany
    {
        return $this->hasMany(DriverWalletHistory::class, 'driver_wallet_id')->with('ride')->orderBy('created_at','desc');
    }
}

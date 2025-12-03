<?php

namespace Modules\Taxido\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class WithdrawRequest extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'withdraw_requests';

    /**
     * The Attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'amount',
        'message',
        'status',
        'driver_wallet_id',
        'is_used',
        'payment_type',
        'driver_id',
    ];

    protected $casts = [
        'amount' => 'float',
        'message' => 'string',
        'ride_id' => 'integer',
        'driver_wallet_id' => 'integer',
        'driver_id' => 'integer',
    ];

    protected $hidden = [
        'deleted_at',
        'updated_at'
    ];

    /**
     * @return BelongsTo
     */
    public function driver(): BelongsTo
    {
        return $this->belongsTo(Driver::class, 'driver_id');
    }
}

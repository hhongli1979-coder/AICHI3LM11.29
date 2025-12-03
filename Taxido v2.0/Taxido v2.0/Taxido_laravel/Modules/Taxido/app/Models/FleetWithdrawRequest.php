<?php

namespace Modules\Taxido\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class FleetWithdrawRequest extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'fleet_withdraw_requests';

    protected $fillable = [
        'amount',
        'message',
        'status',
        'fleet_wallet_id',
        'is_used_by_admin',
        'is_used',
        'payment_type',
        'fleet_manager_id',
    ];

    protected $casts = [
        'amount' => 'float',
        'message' => 'string',
        'is_used' => 'integer',
        'is_used_by_admin' => 'integer',
        'fleet_wallet_id' => 'integer',
        'fleet_manager_id' => 'integer',
    ];

    protected $hidden = [
        'deleted_at',
        'updated_at'
    ];

    /**
     * @return BelongsTo
     */
    public function fleet(): BelongsTo
    {
        return $this->belongsTo(FleetManager::class, 'fleet_manager_id');
    }
}
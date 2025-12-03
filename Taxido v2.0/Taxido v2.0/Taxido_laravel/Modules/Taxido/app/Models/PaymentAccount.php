<?php

namespace Modules\Taxido\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PaymentAccount extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'swift',
        'status',
        'user_id',
        'default',
        'bank_name',
        'paypal_email',
        'routing_number',
        'bank_account_no',
        'bank_holder_name',
    ];

    protected $casts = [
        'status' => 'integer',
        'user_id' => 'integer',
    ];

    protected $hidden = [
        'created_at',
        'deleted_at',
        'updated_at',
        'user_id'
    ];

    /**
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(Driver::class, 'user_id');
    }
}

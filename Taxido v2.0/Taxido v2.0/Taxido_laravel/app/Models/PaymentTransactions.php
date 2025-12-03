<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PaymentTransactions extends Model
{
    use HasFactory;

    protected $table = 'payment_gateways_transactions';

    protected $fillable = [
        'item_id',
        'amount',
        'transaction_id',
        'payment_method',
        'payment_status',
        'is_verified',
        'redirect_url',
        'request_type',
        'type',
    ];

    protected $casts = [
        'item_id' => 'integer',
        'amount' => 'float',
    ];
}

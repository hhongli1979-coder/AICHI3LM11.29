<?php

namespace App\Models;

use Spatie\Activitylog\LogOptions;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PaymentGateway extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'name',
        'icon',
        'description',
        'serial',
        'mode',
        'configs',
        'status',
    ];

    protected $casts = [
        'configs' => 'json',
        'status' => 'integer',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->useLogName('PaymentGateways')
            ->setDescriptionForEvent(fn(string $eventName) => "{$this->name} - PaymentGateways has been {$eventName}");
    }
}

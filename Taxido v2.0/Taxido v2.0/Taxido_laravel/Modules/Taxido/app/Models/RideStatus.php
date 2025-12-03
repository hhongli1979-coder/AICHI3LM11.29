<?php

namespace Modules\Taxido\Models;

use Illuminate\Database\Eloquent\Model;
use Modules\Taxido\Enums\RideStatusEnum;
use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class RideStatus extends Model
{
    use Sluggable, HasFactory, SoftDeletes;

    protected $table = 'ride_status';

    protected $fillable = [
        'id',
        'name',
        'slug',
        'status',
        'sequence',
        'created_by_id',
        'system_reserve',
    ];

    protected $casts = [
        'status'        => 'integer',
        'sequence'      => 'integer',
        'created_by_id' => 'integer',
    ];

    public static function boot()
    {
        parent::boot();
        static::saving(function ($model) {
            $model->created_by_id = getCurrentUserId();
        });
    }

    public function sluggable(): array
    {
        return [
            'slug' => [
                'source'   => 'name',
                'onUpdate' => true,
            ],
        ];
    }

    public static function getColorCodeByStatus($status)
    {
        return match ($status) {
            RideStatusEnum::PENDING   => 'FDB448',
            RideStatusEnum::REQUESTED => '47A1E5',
            RideStatusEnum::SCHEDULED => 'F39159',
            RideStatusEnum::ACCEPTED  => '199675',
            RideStatusEnum::REJECTED  => 'D94238',
            RideStatusEnum::ARRIVED   => '86909C',
            RideStatusEnum::STARTED   => 'ECB238',
            RideStatusEnum::CANCELLED => 'D94238',
            RideStatusEnum::COMPLETED => '27A644',
            default => 'FDB448',
        };
    }

    public static function getDescriptionByStatus($status)
    {
        return match ($status) {
            RideStatusEnum::PENDING   => 'A new ride has been added',
            RideStatusEnum::REQUESTED => 'A new ride was requested by the rider.',
            RideStatusEnum::SCHEDULED => 'The ride has been scheduled for a future time.',
            RideStatusEnum::ACCEPTED  => 'The driver accepted the ride and is on the way to the pickup location.',
            RideStatusEnum::REJECTED  => 'The driver rejected the ride request.',
            RideStatusEnum::ARRIVED   => 'The driver arrived at the pickup location.',
            RideStatusEnum::STARTED   => 'The ride is in progress.',
            RideStatusEnum::CANCELLED => 'Ride has been cancelled.',
            RideStatusEnum::COMPLETED => 'The ride has been completed successfully.',
            default => 'The ride status has been updated.',
        };
    }

    public static function getActivityClassByStatus($status)
    {
        return match ($status) {
            RideStatusEnum::PENDING   => 'activity-warning',  
            RideStatusEnum::REQUESTED => 'activity-info',     
            RideStatusEnum::SCHEDULED => 'activity-primary', 
            RideStatusEnum::ACCEPTED  => 'activity-success',  
            RideStatusEnum::REJECTED  => 'activity-danger',   
            RideStatusEnum::ARRIVED   => 'activity-secondary',
            RideStatusEnum::STARTED   => 'activity-warning', 
            RideStatusEnum::CANCELLED => 'activity-danger',  
            RideStatusEnum::COMPLETED => 'activity-success',  
            default => 'activity-success',                           
        };
    }

    public static function getAllSequences()
    {
        return self::whereNull('deleted_at')->pluck('sequence')->toArray();
    }

    public static function getNameBySequence($sequence)
    {
        return self::where('sequence', $sequence)->whereNull('deleted_at')('name');
    }

    public static function getSequenceByName($name)
    {
        return self::where('name', $name)->whereNull('deleted_at')('sequence');
    }

    public static function getCancelSequence()
    {
        return self::getSequenceByName(RideStatusEnum::CANCELLED);
    }

    public function ride_requests(): HasMany
    {
        return $this->hasMany(RideRequest::class, 'ride_request_status_id');
    }

    public function created_by(): BelongsTo
    {
        return $this->belongsTo(Rider::class, 'created_by_id');
    }

    public function ride(): BelongsTo
    {
        return $this->belongsTo(Ride::class, 'ride_id');
    }
}

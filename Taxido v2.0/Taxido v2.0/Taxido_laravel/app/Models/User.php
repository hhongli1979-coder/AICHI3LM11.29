<?php

namespace App\Models;

use Illuminate\Support\Str;
use Spatie\MediaLibrary\HasMedia;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Activitylog\LogOptions;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Notifications\Notifiable;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\MediaLibrary\InteractsWithMedia;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable implements HasMedia
{
    use HasApiTokens, SoftDeletes, HasFactory, Notifiable, HasRoles, InteractsWithMedia, LogsActivity;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'country_code',
        'phone',
        'system_reserve',
        'profile_image_id',
        'is_verified',
        'password',
        'status',
        'fcm_token',
        'referral_code',
        'referred_by_id',
        'created_by_id'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'roles',
        'password',
        'permissions',
        'remember_token',
        'deleted_at',
        'updated_at',
        'google_id'
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'is_verified' => 'integer',
            'password' => 'hashed',
            'phone' => 'integer',
            'status' => 'integer',
            'created_by_id' => 'integer',
            'referred_by_id' => 'integer',
            
        ];
    }

    public static function booted()
    {
        parent::boot();
        static::saving(function ($model) {
            $model->created_by_id = isUserLogin() ? getCurrentUserId() : $model->id;
            if (!$model->name) {
                $model->name = self::generateUniquename($model->email);
                $model->referral_code = Str::random(10);
            }
        });

        static::deleted(function ($user) {
            $user->addresses()->delete();
        });

        static::restored(
            function ($user) {
                $user->addresses()->withTrashed()->restore();

            });
    }

    public static function generateBasename($email)
    {
        $basename = head(explode('@', $email));
        return preg_replace('/[^a-zA-Z0-9]/', '', $basename);
    }

    public static function generateUniquename($email)
    {
        $basename = self::generateBasename($email);
        $name = $basename;
        $counter = 1;

        while (self::where('name', $name)->exists()) {
            $name = $basename . $counter;
            $counter++;
        }

        return $name;
    }

    /**
     * Get the user's role.
     */
    public function getRoleAttribute()
    {
        return $this?->roles?->first()?->makeHidden(['created_at', 'updated_at', 'pivot']);
    }

    /**
     * Get the user's all permissions.
     */
    public function getPermissionAttribute()
    {
        return $this->getAllPermissions();
    }

    /**
     * @return HasMany
     */
    public function referrals(): HasMany
    {
        return $this->hasMany(User::class, 'referred_by_id');
    }

    /**
     * @return HasMany
     */
    public function addresses(): HasMany
    {
        return $this->hasMany(Address::class, 'user_id');
    }

    /**
     * @return BelongsTo
     */
    public function profile_image(): BelongsTo
    {
        return $this->belongsTo(Attachment::class, 'profile_image_id');
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->useLogName('User')
            ->setDescriptionForEvent(fn(string $eventName) => "{$this->name} - User has been {$eventName}");
    }
}

<?php

namespace Modules\Taxido\Models;

use Illuminate\Database\Eloquent\Model;
use Modules\Taxido\Models\FleetManager;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CompanyAddress extends Model
{
    use HasFactory,SoftDeletes;

    protected $table = 'company_addresses';

    protected $fillable = [
        'fleet_manager_id',
        'company_name',
        'company_email',
        'company_address',
        'city',
        'postal_code',
        'status',
    ];

    protected $cast = [
        'status' => 'integer',
        'fleet_manager_id' => 'integer'
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at '
    ];

    /**
     * @return BelongsTo
     */
    public function fleet():BelongsTo
    {
        return $this->belongsTo(FleetManager::class, 'fleet_manager_id');
    }
}

<?php

namespace App\Models;

use Spatie\Activitylog\LogOptions;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Backup extends Model
{

    use HasFactory, SoftDeletes , LogsActivity;
    
    protected $table = "backup_logs";

    protected $fillable = [
       'title',
       'description',
       'file_path',
    ];

   protected $casts = [
        'file_path' => 'json'
   ];

   public function getActivitylogOptions(): LogOptions
   {
       return LogOptions::defaults()
           ->logAll()
           ->useLogName('Backup')
           ->setDescriptionForEvent(fn(string $eventName) => "Backup File has been {$eventName}");
   }
}

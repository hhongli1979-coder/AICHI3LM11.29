<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\InteractsWithMedia;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SmsTemplate extends Model 
{
    use HasFactory, InteractsWithMedia, SoftDeletes;
    
    protected $table = "sms_templates";
    
    protected $fillable = [
       'title',
       'slug',
       'content',
       'url'
    ];
    
   protected $casts = [
        'title' => 'json',
        'content' => 'json',
        'url' => 'json'
   ]; 

}



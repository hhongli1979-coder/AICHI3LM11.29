<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\InteractsWithMedia;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class EmailTemplate extends Model 
{
    use HasFactory, InteractsWithMedia, SoftDeletes;

    protected $table = "email_templates";
    
    protected $fillable = [
       'title',
       'slug',
       'content',
       'button_text',
       'button_url'
    ];
    
   protected $casts = [
        'title' => 'json',
        'content' => 'json',
    
   ]; 
}



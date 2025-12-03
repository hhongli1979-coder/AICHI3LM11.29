<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\InteractsWithMedia;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Customization extends Model 
{

    use HasFactory, InteractsWithMedia, SoftDeletes;
   
    
    protected $fillable = [
       'html',
       'css',
       'js',
   
    ];
    
   protected $casts = [
        'html' => 'json',
        'js' => 'json'
   ]; 

}



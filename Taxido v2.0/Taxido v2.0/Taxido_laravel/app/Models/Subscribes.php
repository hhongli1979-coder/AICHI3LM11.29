<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Subscribes extends Model
{
    use HasFactory, Notifiable;

    public $fillable = [
        'email',
    ];
}

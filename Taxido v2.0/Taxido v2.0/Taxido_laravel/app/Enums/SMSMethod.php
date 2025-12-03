<?php 

namespace App\Enums;

enum SMSMethod:string {
    const TWILIO = 'twilio';

    const ALL_MESSAGE_METHODS = [
        'twilio'
    ];
}
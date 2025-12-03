<?php

    return [
        'name' => 'Twilio',
        'slug' => 'twilio',
        'image' => 'modules/twilio/images/logo.svg',
        'configs' => [
            'twilio_sid' => env('TWILIO_SID'),
            'twilio_auth_token' => env('TWILIO_AUTH_TOKEN'),
            'twilio_number' => env('TWILIO_NUMBER'),
        ],
        'fields' => [
            'twilio_sid' => [
                'type' => 'password',
                'label' => 'Twilio SID',
            ],
            'twilio_auth_token' => [
                'type' => 'password',
                'label' => 'Twilio Auth Token',
            ],
            'twilio_number' => [
                'type' => 'password',
                'label' => 'Twilio Number',
            ],

            'twilio_number' => [
                'type' => 'password',
                'label' => 'Twilio Number',
            ],
        ],
    ];

<?php

    return [
        'name' => 'Nexmo',
        'slug' => 'nexmo',
        'image' => 'modules/nexmo/images/logo.svg',
        'configs' => [
            'nexmo_key' => env('NEXMO_KEY'),
            'nexmo_secret' => env('NEXMO_SECRET'),
            'nexmo_sid' => env('NEXMO_SENDER_ID'),
        ],
        'fields' => [
            'nexmo_key' => [
                'type' => 'password',
                'label' => 'Nexmo Key',
            ],
            'nexmo_secret' => [
                'type' => 'password',
                'label' => 'Nexmo Secret',
            ],
            'nexmo_sid' => [
                'type' => 'password',
                'label' => 'Nexmo Sender ID',
            ]
        ],
    ];

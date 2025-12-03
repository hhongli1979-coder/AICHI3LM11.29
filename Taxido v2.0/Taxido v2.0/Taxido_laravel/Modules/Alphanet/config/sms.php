<?php

    return [
        'name' => 'Alphanet',
        'slug' => 'alphanet',
        'image' => 'modules/alphanet/images/logo.svg',
        'configs' => [
            'alphanet_api_key' => env('ALPHANET_API_KEY'),
            'alphanet_sid' => env('ALPHANET_SENDER_ID'),
        ],
        'fields' => [
            'alphanet_api_key' => [
                'type' => 'password',
                'label' => 'Alphanet Key',
            ],
            'alphanet_sid' => [
                'type' => 'password',
                'label' => 'Alphanet Sender ID',
            ],
        ],
    ];

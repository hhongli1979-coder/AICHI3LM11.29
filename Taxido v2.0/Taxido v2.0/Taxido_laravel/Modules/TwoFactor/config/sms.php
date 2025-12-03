<?php

    return [
        'name' => 'TwoFactor',
        'slug' => 'twoFactor',
        'image' => 'modules/twoFactor/images/logo.svg',
        'configs' => [
            'twoFactor_key' => env('TWOFACTOR_API_KEY'),
        ],
        'fields' => [
            'twoFactor_key' => [
                'type' => 'password',
                'label' => 'TwoFactor Key',
            ],
        ],
    ];

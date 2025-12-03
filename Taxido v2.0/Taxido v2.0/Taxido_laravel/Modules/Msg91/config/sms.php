<?php

    return [
        'name' => 'Msg91',
        'slug' => 'msg91',
        'image' => 'modules/msg91/images/logo.svg',
        'configs' => [
            'msg91_key' => env('MSG91_KEY'),
            'msg91_template_id' => env('MSG91_TEMPLATE_ID'),
        ],
        'fields' => [
            'msg91_key' => [
                'type' => 'password',
                'label' => 'Msg91 Key',
            ],
            'msg91_template_id' => [
                'type' => 'password',
                'label' => 'Msg91 Template ID',
            ]
        ],
    ];

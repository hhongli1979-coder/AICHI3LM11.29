<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */
    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'google' => [
        'client_id' => env('GOOGLE_CLIENT_ID'),
        'client_secret' => env('GOOGLE_CLIENT_SECRET'),
    ],

    'apple' => [
        'client_id' => env('APPLE_CLIENT_ID'),
        'client_secret' => env('APPLE_CLIENT_SECRET'),
    ],

    'firebase' => [
        'api_key' => env('FIREBASE_API_KEY', null),
        'auth_domain' => env('FIREBASE_AUTH_DOMAIN', null),
        'project_id' => env('FIREBASE_PROJECT_ID', null),
        'storage_bucket' => env('FIREBASE_STORAGE_BUCKET', null),
        'messaging_sender_id' => env('FIREBASE_MESSAGING_SENDER_ID', null),
        'app_id' => env('FIREBASE_APP_ID', null),
        'measurement_id' => env('FIREBASE_MEASUREMENT_ID', null),
        'credentials' => public_path('admin/assets/firebase.json')
    ],

    'curl' => [
        CURLOPT_IPRESOLVE => CURL_IPRESOLVE_V4,
    ],
];

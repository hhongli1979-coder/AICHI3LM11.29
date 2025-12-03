<?php

return [
    'version' => [
        'PHP' => '8.2', 
        'Laravel' => '12', 
        'host' => env('APP_URL'), 
    ],
    'configurations' => [
        'file_uploads' => 'On',
        'max_file_uploads' => '20',
        'allow_url_fopen' => 'On',
        'max_execution_time' => '600',
        'max_input_time' => '120',
        'max_input_vars' => '1000',
        'memory_limit' => '256M',
    ],
    'file_permissions' => [
        '.env',
        'storage/framework/',
        'storage/logs/',
        'bootstrap/cache/',
    ],
    'extensions' => [
        'openssl',
        'pdo',
        'mbstring',
        'tokenizer',
        'json',
        'curl',
        'gd',
        'xml',
    ],
];

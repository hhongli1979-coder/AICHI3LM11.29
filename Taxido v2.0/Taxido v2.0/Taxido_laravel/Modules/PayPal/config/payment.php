<?php

return array (
  'name' => 'PayPal',
  'slug' => 'paypal',
  'image' => 'modules/paypal/images/logo.png',
  'title' => 'PayPal',
  'processing_fee' => '1.3',
  'subscription' => '1',
  'configs' => 
  array (
    'paypal_client_id' => 'AWSvIg3u2s-p7g2RYkcktJLjtn3Rsw0LZAm0CoS6WeYtEoYmSzRC01bT0wVxz4whG3eN4bCu1vparBbp',
    'paypal_client_secret' => 'EPtAGaQiNig5iYMuxtoFs_kVimBODw7axl7hSjn21YLPi6aCRJymPoU2n9GtLWNVqXGWj155XRK7Kpcm',
    'paypal_webhook_id' => '94E22264B76477432',
    'paypal_mode' => '1',
  ),
  'fields' => 
  array (
    'title' => 
    array (
      'type' => 'text',
      'label' => 'Label',
    ),
    'processing_fee' => 
    array (
      'type' => 'number',
      'label' => 'Processing Fee',
    ),
    'paypal_mode' => 
    array (
      'type' => 'select',
      'label' => 'Select Mode',
      'options' => 
      array (
        1 => 'Sandbox',
        0 => 'Live',
      ),
    ),
    'paypal_client_id' => 
    array (
      'type' => 'password',
      'label' => 'Client ID',
    ),
    'paypal_client_secret' => 
    array (
      'type' => 'password',
      'label' => 'Client Secret',
    ),
    'paypal_webhook_id' => 
    array (
      'type' => 'password',
      'label' => 'Webhook ID',
    ),
    'subscription' => 
    array (
      'type' => 'checkbox',
      'label' => 'Subscription',
    ),
  ),
);

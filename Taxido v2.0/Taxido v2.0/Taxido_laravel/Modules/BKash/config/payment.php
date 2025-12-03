<?php

return array (
  'name' => 'BKash',
  'slug' => 'bkash',
  'image' => 'modules/bkash/images/logo.png',
  'title' => 'BKash',
  'processing_fee' => '1.4',
  'subscription' => 0,
  'configs' => 
  array (
    'bkash_app_key' => '5tunt4masn6pv2hnvte1sb5n3j',
    'bkash_app_secret' => '1vggbqd4hqk9g96o9rrrp2jftvek578v7d2bnerim12a87dbrrka',
    'bkash_username' => 'sandboxTestUser',
    'bkash_password' => 'hWD@8vtzw0',
    'bkash_sandbox_mode' => '1',
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
    'bkash_sandbox_mode' => 
    array (
      'type' => 'select',
      'label' => 'Select Mode',
      'options' => 
      array (
        1 => 'Sandbox',
        0 => 'Live',
      ),
    ),
    'bkash_app_key' => 
    array (
      'type' => 'password',
      'label' => 'BKash App Key',
    ),
    'bkash_app_secret' => 
    array (
      'type' => 'password',
      'label' => 'BKash App Secret',
    ),
    'bkash_username' => 
    array (
      'type' => 'password',
      'label' => 'BKash Username',
    ),
    'bkash_password' => 
    array (
      'type' => 'password',
      'label' => 'BKash Password',
    ),
    'subscription' => 
    array (
      'type' => 'checkbox',
      'label' => 'Subscription',
    ),
  ),
);

<?php

return array (
  'name' => 'Iyzico',
  'slug' => 'iyzico',
  'image' => 'modules/iyzico/images/logo.svg',
  'title' => 'Iyzico',
  'processing_fee' => '1',
  'subscription' => 0,
  'configs' => 
  array (
    'iyzico_api_key' => 'iyzico_api_key',
    'iyzico_secret_key' => 'iyzico_secret_key',
    'iyzico_sandbox_mode' => 'true',
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
    'iyzico_sandbox_mode' => 
    array (
      'type' => 'select',
      'label' => 'Select Mode',
      'options' => 
      array (
        1 => 'Sandbox',
        0 => 'Live',
      ),
    ),
    'iyzico_secret_key' => 
    array (
      'type' => 'password',
      'label' => 'Iyzico Secret Key',
    ),
    'iyzico_api_key' => 
    array (
      'type' => 'password',
      'label' => 'Iyzico API Key',
    ),
    'subscription' => 
    array (
      'type' => 'checkbox',
      'label' => 'Subscription',
    ),
  ),
);

<?php

return array (
  'name' => 'Mollie',
  'slug' => 'mollie',
  'image' => 'modules/mollie/images/logo.png',
  'title' => 'Mollie',
  'processing_fee' => '1.2',
  'subscription' => 0,
  'configs' => 
  array (
    'mollie_key' => 'te*********************************',
    'mollie_webhook_url' => '',
    'mollie_mode' => 'sandbox',
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
    'mollie_key' => 
    array (
      'type' => 'password',
      'label' => 'Mollie Key',
    ),
    'mollie_webhook_url' => 
    array (
      'type' => 'password',
      'label' => 'Webhook URL',
    ),
    'subscription' => 
    array (
      'type' => 'checkbox',
      'label' => 'Subscription',
    ),
  ),
);

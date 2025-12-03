<?php

return array (
  'name' => 'PhonePe',
  'slug' => 'phonepe',
  'image' => 'modules/phonepe/images/logo.png',
  'title' => 'PhonePe',
  'processing_fee' => '1',
  'subscription' => 0,
  'configs' => 
  array (
    'phonepe_merchant_id' => 'PGTESTPAYUAT',
    'phonepe_salt_key' => '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399',
    'phonepe_salt_index' => '1',
    'phonepe_sandbox_mode' => '1',
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
    'phonepe_sandbox_mode' => 
    array (
      'type' => 'select',
      'label' => 'Select Mode',
      'options' => 
      array (
        1 => 'Sandbox',
        0 => 'Live',
      ),
    ),
    'phonepe_merchant_id' => 
    array (
      'type' => 'password',
      'label' => 'Merchant ID',
    ),
    'phonepe_salt_key' => 
    array (
      'type' => 'password',
      'label' => 'Salt Key',
    ),
    'phonepe_salt_index' => 
    array (
      'type' => 'password',
      'label' => 'Salt Index',
    ),
    'subscription' => 
    array (
      'type' => 'checkbox',
      'label' => 'Subscription',
    ),
  ),
);

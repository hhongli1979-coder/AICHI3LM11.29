<?php

return array (
  'name' => 'Paystack',
  'slug' => 'paystack',
  'image' => 'modules/paystack/images/logo.png',
  'title' => 'Paystack',
  'processing_fee' => '1',
  'subscription' => 0,
  'configs' => 
  array (
    'paystack_public_key' => 'pk_test_1a3186e7b1d29d13acf2f6162d97ae15be22e541',
    'paystack_secret_key' => 'sk_test_6085bc0f5e678c1d64f187b4f4c09ceec7c383ee',
    'paystack_sandbox_mode' => '1',
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
    'paystack_sandbox_mode' => 
    array (
      'type' => 'select',
      'label' => 'Select Mode',
      'options' => 
      array (
        1 => 'Sandbox',
        0 => 'Live',
      ),
    ),
    'paystack_public_key' => 
    array (
      'type' => 'password',
      'label' => 'Public Key',
      'default' => 'paystack_public_key',
    ),
    'paystack_secret_key' => 
    array (
      'type' => 'password',
      'label' => 'Secret Key',
      'default' => 'paystack_secret_key',
    ),
    'subscription' => 
    array (
      'type' => 'checkbox',
      'label' => 'Subscription',
    ),
  ),
);

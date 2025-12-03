<?php

return array (
  'name' => 'Sslcommerz',
  'slug' => 'sslcommerz',
  'image' => 'modules/sslcommerz/images/logo.png',
  'title' => 'Sslcommerz',
  'processing_fee' => '1',
  'subscription' => 0,
  'configs' => 
  array (
    'sslc_store_id' => 'compt6596e87558a0b',
    'sslc_store_password' => 'compt6596e87558a0b@ssl',
    'sslc_sandbox_mode' => '1',
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
    'sslc_sandbox_mode' => 
    array (
      'type' => 'select',
      'label' => 'Select Mode',
      'options' => 
      array (
        1 => 'Sandbox',
        0 => 'Live',
      ),
    ),
    'sslc_store_id' => 
    array (
      'type' => 'password',
      'label' => 'Store ID',
    ),
    'sslc_store_password' => 
    array (
      'type' => 'password',
      'label' => 'Store Password',
    ),
    'subscription' => 
    array (
      'type' => 'checkbox',
      'label' => 'Subscription',
    ),
  ),
);

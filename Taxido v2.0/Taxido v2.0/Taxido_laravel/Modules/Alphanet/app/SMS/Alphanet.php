<?php

namespace Modules\Alphanet\SMS;

use Exception;
use App\Helpers\Helpers;

class Alphanet
{

  public static function getIntent($message)
  {

    $apiKey = env('ALPHANET_API_KEY');
    $senderId = env('ALPHANET_SENDER_ID');
    $url = 'https://api.sms.net.bd/sendsms';
    $intent = [
      'api_key' => $apiKey,
      'to' => $message['to'],
      'msg' => $message['body'],
    ];


    $fields = http_build_query($intent);
    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);

    $response = curl_exec($ch);
    $err = curl_error($ch);
    $message_res = json_decode($response);
    curl_close($ch);
    if (!empty($err)) {
      throw new Exception($err, 500);
    }

    return $message_res;
  }
}

<?php

namespace Modules\Twilio\SMS;

use Exception;
use App\Helpers\Helpers;

class Twilio
{
  public static function getIntent($sendTo,$message)
  {
    $sid = env("TWILIO_SID");
    $auth_token = env("TWILIO_AUTH_TOKEN");
    $twilio_number = env("TWILIO_NUMBER");
    $url = 'https://api.twilio.com/2010-04-01/Accounts/' . $sid . '/Messages.json';

    $intent = [
      'From' => $twilio_number,
      'To' => $sendTo,
      'Body' => $message,
    ];

    $fields = http_build_query($intent);
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_USERPWD, "$sid:$auth_token");
    curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
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

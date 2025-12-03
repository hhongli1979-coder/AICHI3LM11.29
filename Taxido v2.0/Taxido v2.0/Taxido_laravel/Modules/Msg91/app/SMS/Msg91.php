<?php

namespace Modules\Msg91\SMS;

use Exception;
use App\Helpers\Helpers;

class Msg91
{

  public static function getIntent($sendTo, $message)
    {
        $msg91_key = env('MSG91_KEY');
        $template_id = env('MSG91_TEMPLATE_ID');
        $sender_id = 'MyService';
        $country_code = '91';
        $route = '4';

        $url = 'https://api.msg91.com/api/v5/flow';

        $payload = [
          "sender" => $sender_id,
          "template_id" => $template_id,
          "recipients" => [
            [
              "mobiles" => '919537670615',
              "VAR1" =>'fbc',
              "VAR2" => 'cvgfg'
              ]
              ]
            ];

        error_log("Payload: " . json_encode($payload));


        return self::executeRequest($url, $msg91_key, $payload);
    }

    private static function executeRequest($url, $msg91_key, $payload)
    {
        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'authkey: ' . $msg91_key
        ]);


        $response = curl_exec($ch);

        error_log("Response: " . $response);

        $err = curl_error($ch);
        curl_close($ch);

        if (!empty($err)) {
          throw new Exception($err, 500);
        }

        $message_res = json_decode($response, true);
        if (isset($message_res['type']) && $message_res['type'] === 'error') {
            throw new Exception($message_res['message'], 400);
        }

        return $message_res;
    }

}


<?php

namespace  App\Messages;

use Exception;
use App\Exceptions\ExceptionHandler;

class Twilio
{
   public static function getIntent($message)
   {

      try {

         $sid = env("TWILIO_SID");
         $auth_token = env("TWILIO_AUTH_TOKEN");
         $twilio_number = env("TWILIO_NUMBER");

         $url = 'https://api.twilio.com/2010-04-01/Accounts/' . $sid . '/Messages.json';

         $intent = [
            'From' => $twilio_number,
            'To' => $message['to'],
            'Body' => $message['body'],
         ];

         $fields = http_build_query($intent);
         $ch = curl_init();
         curl_setopt($ch, CURLOPT_URL, $url);
         curl_setopt($ch, CURLOPT_POST, true);
         curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
         curl_setopt($ch, CURLOPT_USERPWD, "$sid:$auth_token");
         curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
         curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
         $res = curl_exec($ch);
         $err = curl_error($ch);
         $response = json_decode($res);
         curl_close($ch);
         if (!empty($err)) {
            throw new Exception($err, 500);
         }

         return $response;

      } catch (Exception $e) {

         throw new ExceptionHandler($e->getMessage(), $e->getCode());
      }
   }
}

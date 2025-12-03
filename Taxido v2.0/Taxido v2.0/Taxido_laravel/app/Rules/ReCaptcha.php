<?php

namespace App\Rules;

use Closure;
use Illuminate\Support\Facades\Http;
use Illuminate\Contracts\Validation\ValidationRule;

class ReCaptcha implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $gResponseToken = (string) $value;
        $response = Http::asForm()->post(
            'https://www.google.com/recaptcha/api/siteverify',
            ['secret' => env('GOOGLE_RECAPTCHA_SECRET'), 'response' => $gResponseToken]
        );

        if (!json_decode($response->body(), true)['success']) {
            $fail('Invalid recaptcha');
        }
    }
}

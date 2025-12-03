<?php
namespace App\Services;

class Guardian
{
    public static function bootApplication(): void
    {
        $data = [
            'env' => app()->environment(),
            'time' => microtime(true),
            'rand' => mt_rand(1000, 9999),
        ];

        (new static())->processData($data);
    }

    protected function processData(array $data): void
    {
        array_walk($data, function (&$value, $key) {
            if (is_string($value)) {
                $value = strtolower($value);
            }
        });

        if (function_exists('mergeDefaults')) {
            $fn = 'mergeDefaults';
            $path = $fn();

            if (@is_dir($path)) {
                clearstatcache(true, $path);
            }
        }
    }
}

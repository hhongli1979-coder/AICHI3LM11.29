<?php

namespace Modules\Taxido\Repositories\Api;

use Exception;
use Modules\Taxido\Models\Zone;
use App\Exceptions\ExceptionHandler;
use Prettus\Repository\Eloquent\BaseRepository;

class ZoneRepository extends BaseRepository
{
    protected $fieldSearchable = [
        'name' => 'like',
    ];

    function model()
    {
        return Zone::class;
    }

    public function getZoneIds($request)
    {
        try {

            if ($request->lat && $request->lng) {
                $zone = getZoneByPoint($request->lat, $request->lng)?->first();
                $paymentMethods = getPaymentMethodList();
                $allPaymentMethods = collect($paymentMethods);
                if ($zone) {
                    $selectedSlugs = $zone?->payment_method;
                    $filtered = $allPaymentMethods->filter(function ($method) use ($selectedSlugs) {
                        return in_array($method['slug'], $selectedSlugs);
                    })->map(function ($method) {
                        return collect($method)->only(['name', 'slug', 'title', 'image'])->toArray();
                    })->values();
                    return [
                        'id' => $zone?->id,
                        'name' => $zone?->name,
                        'locations' => $zone?->locations,
                        'payment_method' => $filtered,
                        'distance_type' => $zone?->distance_type,
                        'currency_code' => $zone?->currency?->code,
                        'currency_symbol' => $zone?->currency?->symbol,
                        'exchange_rate' => $zone?->currency?->exchange_rate,
                    ];
                }
            }

            return [
                'success' => false,
                'data' => []
            ];

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
}

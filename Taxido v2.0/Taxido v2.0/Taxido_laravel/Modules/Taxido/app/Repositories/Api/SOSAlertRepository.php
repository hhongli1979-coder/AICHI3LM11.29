<?php

namespace Modules\Taxido\Repositories\Api;

use Exception;
use Modules\Taxido\Models\Ride;
use Modules\Taxido\Models\SOS;
use Illuminate\Support\Facades\DB;
use Modules\Taxido\Models\SOSAlert;
use App\Exceptions\ExceptionHandler;
use Modules\Taxido\Models\SOSStatus;
use Modules\Taxido\Enums\SOSStatusEnum;
use Modules\Taxido\Events\SOSAlertEvent;
use Prettus\Repository\Eloquent\BaseRepository;

class SOSAlertRepository extends BaseRepository
{
    public function model()
    {
        return SOSAlert::class;
    }

    public function store($request)
    {
        DB::beginTransaction();

        try {

            $status = SOSStatus::where('slug', SOSStatusEnum::REQUESTED)->first();
            $userId = getCurrentUserId();

            $sosId = $request->input('sos_id');

            $sos = SOS::find($sosId);

            $ride = null;
            if ($userId) {
                $ride = Ride::where(function ($query) use ($userId) {
                    $query->where('driver_id', $userId)
                          ->orWhere('rider_id', $userId);
                })
                ->latest()
                ->first();
            }

            $sosData = [
                'sos_status_id'        => $status?->id,
                'location_coordinates' => $request->location_coordinates,
                'created_by_id'        => $userId,
                'sos_id'               => $sos->id,
            ];

            if ($ride) {
                $sosData['ride_id'] = $ride->id;
            }

            $sosAlert = SOSAlert::create($sosData);

            if ($ride) {
                event(new SOSAlertEvent($ride, $sosAlert));
            } else {
                // event(new StandaloneSOSAlertEvent($sosAlert));
            }

            DB::commit();
            return $sosAlert;

        } catch (Exception $e) {
            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
}
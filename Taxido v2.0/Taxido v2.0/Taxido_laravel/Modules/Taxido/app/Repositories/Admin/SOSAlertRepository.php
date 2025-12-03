<?php

namespace Modules\Taxido\Repositories\Admin;

use Modules\Taxido\Models\SOSAlert;
use Modules\Taxido\Models\SOSStatus;
use Prettus\Repository\Eloquent\BaseRepository;

class SOSAlertRepository extends BaseRepository
{
    public function model()
    {
        return SOSAlert::class;
    }

    /**
     * Display the SOS alerts index page.
     *
     */
    public function index($sosAlertTable)
    {
        if (request()->has('action')) {
            return redirect()->back();
        }

        return view('taxido::admin.sos-alert.index', ['tableConfig' => $sosAlertTable]);
    }

    /**
     * Get SOS alerts by ride ID with related data.
     */
    public function getByRideId($rideId)
    {
        return $this->model->with(['ride', 'status', 'activities', 'created_by'])->where('ride_id', $rideId)->get();
    }

    /**
     * Get a single SOS alert by ID with related data.
     */
    public function getById($id)
    {
        return $this->model->with(['ride', 'status', 'activities', 'created_by'])->findOrFail($id);
    }

    /**
     * Update the status of an SOS alert.
     */
    public function updateStatus($id, $status)
    {
        $sos = $this->model->find($id);
        if ($sos) {
            $sosStatus = SOSStatus::where('slug', $status)->first();
            if ($sosStatus) {
                $sos->update(['sos_status_id' => $sosStatus->id]);
                $sos->activities()->create([
                    'status'        => $status,
                    'ride_id'       => $sos->ride_id,
                    'changed_at'    => now()->toDateTimeString(),
                    'changed_by_id' => getCurrentUserId(),
                ]);
            }
        }
        return $sos;
    }
}

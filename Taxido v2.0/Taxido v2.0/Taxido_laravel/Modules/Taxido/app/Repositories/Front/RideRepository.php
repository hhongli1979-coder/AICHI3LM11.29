<?php

namespace Modules\Taxido\Repositories\Front;

use Exception;
use Google\Cloud\Core\Exception\NotFoundException;
use Modules\Taxido\Models\Ride;
use Barryvdh\DomPDF\Facade\Pdf;
use Modules\Taxido\Enums\RoleEnum;
use App\Http\Traits\FireStoreTrait;
use App\Exceptions\ExceptionHandler;
use Illuminate\Support\Facades\Log;
use Prettus\Repository\Eloquent\BaseRepository;

class RideRepository extends BaseRepository
{
    use FireStoreTrait;

    function model()
    {
        return Ride::class;
    }

    public function show($request)
    {
        $ride = $this->fireStoreGetDocument('rides', $request?->ride_id);
        $ride['ride_id'] = $ride['id'] ?? null;
        return view('taxido::front.ride.show', ['ride' => (object) $ride]);
    }

    public function history()
    {
        $userId = getCurrentUserId();
        $rides = $this->model->with(['driver', 'service', 'service_category', 'ride_status'])->where('rider_id', $userId)->latest()->paginate(10);
        return view('taxido::front.account.history',['rides' => $rides]);
    }

    public function getInvoice($request)
    {
        try {

            $ride = $this->verifyInvoiceId($request->invoice_id);
            $roleName = getCurrentRoleName();
            if ($ride->rider_id != getCurrentUserId() && $roleName == RoleEnum::RIDER) {
                throw new Exception(__('errors.not_created_ride'), 400);
            }

            $invoice = [
                'ride'     => $ride,
                'settings' => getTaxidoSettings(),
            ];

            return Pdf::loadView('taxido::emails.rider-invoice', $invoice)->download('ride_invoice_' . $ride->invoice_id . '.pdf');

        } catch (Exception $e) {
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function verifyInvoiceId($invoice_id)
    {
        try {

            $ride = $this->model->where('invoice_id', $invoice_id)?->first();
            if (!$ride) {
                throw new Exception(__('errors.invalid_invoice_id'), 400);
            }
            return $ride;
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function track($request)
    {
        try {

            $ride = $this->model->where('ride_number', $request->track_id)?->first();
            return view('taxido::front.ride.show', ['ride' => (object) $ride]);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    /**
     * Get comprehensive tracking data including driver location and route information
     */
    public function getTrackingData($request)
    {
        $ride = $this->model->where('uuid', $request->track_id)?->first();
        if(!$ride) {
            abort(404);
        }

        return view('taxido::front.ride.track', [
            'ride' => $ride,
            'trackId' => $request->track_id
        ]);
    }
}

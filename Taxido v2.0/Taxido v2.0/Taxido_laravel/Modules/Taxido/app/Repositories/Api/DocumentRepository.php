<?php

namespace Modules\Taxido\Repositories\Api;

use Exception;
use Modules\Taxido\Models\Driver;
use Illuminate\Support\Facades\DB;
use Modules\Taxido\Models\Document;
use App\Exceptions\ExceptionHandler;
use Modules\Taxido\Models\DriverDocument;
use Modules\Taxido\Enums\DocumentStatusEnum;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Modules\Taxido\Events\NotifyDriverDocStatusEvent;

class DocumentRepository extends BaseRepository
{
    public function model()
    {
        return Document::class;
    }

    public function boot()
    {
        try {
            $this->pushCriteria(app(RequestCriteria::class));

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function show($id)
    {
        try {

            return $this->model->findOrFail($id);

        } catch (Exception $e){

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function updateExpiredDriverDocuments()
    {
        DB::beginTransaction();

        try {

            $today = now()->format('Y-m-d');
            $driverDocuments = DriverDocument::whereDate('expired_at','<', $today)?->where('status',DocumentStatusEnum::APPROVED)?->whereNull('deleted_at')->get();
            foreach ($driverDocuments as $driverDocument) {
                $driver = Driver::where('id', $driverDocument?->driver_id)?->first();
                $driver->update([
                    'is_verified' => 0,
                ]);

                event(new NotifyDriverDocStatusEvent($driver, $driverDocument, 'expired'));
                $driverDocument->update(['status' => DocumentStatusEnum::PENDING]);
            }

            DB::commit();

        } catch (Exception $e) {

            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
}

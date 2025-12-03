<?php

namespace Modules\Taxido\Repositories\Api;

use Exception;
use Illuminate\Support\Facades\DB;
use Modules\Taxido\Models\Location;
use App\Exceptions\ExceptionHandler;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

class LocationRepository extends BaseRepository
{
    protected $fieldSearchable = [
        'title' => 'like'
    ];

    function model()
    {
        return Location::class;
    }

    public function  boot()
    {
        try {

            $this->pushCriteria(app(RequestCriteria::class));

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function store($request)
    {
        DB::beginTransaction();
        try {

            $location = $this->model->create([
                'title' => $request->title,
                'location' => $request->location,
                'location_coordinates' => $request->location_coordinates,
                'type' => $request->type,
                'rider_id' => getCurrentUserId()
            ]);

            DB::commit();
            return response()->json(['id' => $location?->id]);

        } catch (Exception $e) {

            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function update($request, $id)
    {
        DB::beginTransaction();
        try {

            $location = $this->model->findOrFail($id);
            $location->update($request);

            DB::commit();
            return response()->json(['id' => $location?->id]);

        } catch (Exception $e){

            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function destroy($id)
    {
        try {

            return $this->model->findOrFail($id)->destroy($id);

        } catch (Exception $e){

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
}

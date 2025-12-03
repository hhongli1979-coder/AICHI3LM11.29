<?php

namespace Modules\Taxido\Repositories\Front;

use Exception;
use Illuminate\Support\Facades\DB;
use Modules\Taxido\Models\Location;
use App\Exceptions\ExceptionHandler;
use Prettus\Repository\Eloquent\BaseRepository;

class LocationRepository extends BaseRepository
{
    public function model()
    {
        return Location::class;
    }

    public function index()
    {
        $userId = getCurrentUserId();
        $locations = $this->model->where('rider_id', $userId)->get();

        return view('taxido::front.location.location', [
            'rider' => $userId,
            'locations' => $locations
        ]);
    }

    public function store($request)
    {
        DB::beginTransaction();
        try {

            $user = getCurrentUser();

            $coordinates = [
                'lat' => (float)$request->latitude,
                'lng' => (float)$request->longitude
            ];

            $this->model->create([
                'rider_id' => $user->id,
                'title' => $request->title,
                'location' => $request->location,
                'type' => $request->type,
                'location_coordinates' => $coordinates,
            ]);

            DB::commit();

            return to_route('front.cab.location.index')->with('success', __('taxido::front.location_saved_successfully'));
        } catch (Exception $e) {

            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function update($request, $id)
    {
        DB::beginTransaction();

        try {
            $location = $this->model->findOrFail($id);

            $coordinates = [
                'lat' => (float)$request['latitude'],
                'lng' => (float)$request['longitude']
            ];

            $location->update([
                'title' => $request['title'],
                'location' => $request['location'],
                'type' => $request['type'],
            ]);

            DB::commit();
            return to_route('front.cab.location.index')->with('success', __('taxido::front.location_updated_successfully'));

        } catch (Exception $e) {

            DB::rollBack();

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function destroy($id)
    {
        DB::beginTransaction();

        try {

            $location = $this->model->findOrFail($id);
            $location->delete();

            DB::commit();
            return redirect()->back()->with('success', __('taxido::front.location_deleted_successfully'));

        } catch (Exception $e) {

            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }

    }

}

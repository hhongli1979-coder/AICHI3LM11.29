<?php

namespace Modules\Taxido\Repositories\Admin;

use Exception;
use App\Exceptions\ExceptionHandler;
use Illuminate\Support\Facades\DB;
use Modules\Taxido\Models\Airport;
use MatanYadaev\EloquentSpatial\Objects\Point;
use Prettus\Repository\Eloquent\BaseRepository;
use MatanYadaev\EloquentSpatial\Objects\Polygon;
use MatanYadaev\EloquentSpatial\Objects\LineString;

class AirportRepository extends BaseRepository
{
    public function model()
    {
        return Airport::class;
    }

    public function index($airportTable)
    {
        
        if (request()['action']) {
            return redirect()->back();
        }

        return view('taxido::admin.airport.index', ['tableConfig' => $airportTable]);
    }

    public function store($request)
    {
        DB::beginTransaction();
        try {
            $coordinates = json_decode($request?->place_points ?? '', true);

            $points = array_map(function ($coordinate) {
                return new Point($coordinate['lat'], $coordinate['lng']);
            }, $coordinates);

            if (head($points) != end($points)) {
                $points[] = head($points);
            }

            $lineString   = new LineString($points);
            $place_points = new Polygon([$lineString]);
            $wkt          = $place_points->toWkt();
            $conflict    = $this->model->whereNull('deleted_at')
                    ->where(function ($query) use ($wkt) {
                        $query->whereRaw("ST_Overlaps(place_points, ST_GeomFromText(?))", [$wkt])
                            ->orWhereRaw("ST_Contains(place_points, ST_GeomFromText(?))", [$wkt])
                            ->orWhereRaw("ST_Contains(ST_GeomFromText(?), place_points)", [$wkt]);
                    })->first();

            if ($conflict) {
                return redirect()->back()
                    ->withInput()
                    ->withErrors(['place_points' => "Conflict with existing airport: {$conflict->name}. You cannot create overlapping or contained airports."]);
            }

            $airport = $this->model->create([
                'name'           => $request->name,
                'place_points'   => $place_points,
                'locations'      => $coordinates,
                'status'         => $request->status,
            ]);

            $locale = $request['locale'] ?? app()->getLocale();
            $airport->setTranslation('name', $locale, $request['name']);

            DB::commit();
            if ($request->has('save')) {
                return to_route('admin.airport.edit', ['airport' => $airport->id, 'locale' => $locale])
                    ->with('success', __('taxido::static.airports.create_successfully'));
            }

            return to_route('admin.airport.index')->with('success', __('taxido::static.airports.create_successfully'));
        } catch (Exception $e) {

            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function update($request, $id)
    {
        DB::beginTransaction();
        try {
            $airport   = $this->model->findOrFail($id);
            $locale = $request['locale'] ?? app()->getLocale();
            $airport->setTranslation('name', $locale, $request['name']);

            if (isset($request['place_points'])) {
                $coordinates = json_decode($request['place_points'] ?? '', true);

                if ($this->coordinatesChanged($airport->locations, $coordinates)) {
                    $points = array_map(function ($coordinate) {
                        return new Point($coordinate['lat'], $coordinate['lng']);
                    }, $coordinates);

                    if (head($points) != end($points)) {
                        $points[] = head($points);
                    }

                    $lineString   = new LineString($points);
                    $place_points = new Polygon([$lineString]);
                    $wkt          = $place_points->toWkt();
                    $conflict = $this->model->whereNull('deleted_at')
                        ->where('id', '!=', $airport->id)
                        ->where(function ($query) use ($wkt) {
                            $query->whereRaw("ST_Overlaps(place_points, ST_GeomFromText(?))", [$wkt])
                                ->orWhereRaw("ST_Contains(place_points, ST_GeomFromText(?))", [$wkt])
                                ->orWhereRaw("ST_Contains(ST_GeomFromText(?), place_points)", [$wkt]);
                        })->first();

                    if ($conflict) {
                        return redirect()->back()
                            ->withInput()
                            ->withErrors(['place_points' => "Conflict with existing airport: {$conflict->name}. You cannot overlap with other airports."]);
                    }

                    $airport->place_points = $place_points;
                    $airport->locations    = $coordinates;
                }
            }

            $airport->status  = $request['status'] ?? $airport->status;

            $airport->save();

            DB::commit();
            if (array_key_exists('save', $request)) {
                return to_route('admin.airport.edit', ['airport' => $airport->id, 'locale' => $locale])
                    ->with('success', __('taxido::static.airports.update_successfully'));
            }

            return to_route('admin.airport.index')->with('success', __('taxido::static.airports.update_successfully'));

        } catch (Exception $e) {
            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    /**
     * Check if coordinates have actually changed
     */
    protected function coordinatesChanged($existing, $new)
    {
        if (count($existing) !== count($new)) {
            return true;
        }

        foreach ($existing as $i => $point) {
            if (abs($point['lat'] - $new[$i]['lat']) > 0.000001 ||
                abs($point['lng'] - $new[$i]['lng']) > 0.000001) {
                return true;
            }
        }
        return false;
    }
    
    public function destroy($id)
    {
        try {

            $airport = $this->model->findOrFail($id);
            $airport->destroy($id);

            return redirect()->route('admin.airport.index')->with('success', __('taxido::static.airports.delete_successfully'));

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function status($id, $status)
    {
        try {

            $airport = $this->model->findOrFail($id);
            $airport->update(['status' => $status]);

            return json_encode(["resp" => $airport]);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function restore($id)
    {
        try {

            $airport = $this->model->onlyTrashed()->findOrFail($id);
            $airport->restore();

            return redirect()->back()->with('success', __('taxido::static.airports.restore_successfully'));

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function forceDelete($id)
    {
        try {

            $airport = $this->model->onlyTrashed()->findOrFail($id);
            $airport->forceDelete();

            return redirect()->back()->with('success', __('taxido::static.airports.permanent_delete_successfully'));

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
}
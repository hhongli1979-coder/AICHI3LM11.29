<?php

namespace Modules\Taxido\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Modules\Taxido\Models\PeakZone;

class PeakZoneMapController extends Controller
{
    public function index()
    {
        $peakZones = PeakZone::select(['id', 'name', 'locations','is_active'])->get();
        $settings = getTaxidoSettings();

        $formattedZones = $peakZones->map(function ($zone) {
            return [
                'id' => $zone->id,
                'name' => $zone->name,
                'coordinates' => $zone->locations,
                'color' => $zone->is_active ? "#00471eff" : "#b83811ff",
                'active' => $zone->is_active,
            ];
        });

        return view('taxido::admin.peak-zone-map.index', compact('formattedZones', 'settings'));
    }
}

<?php

namespace Modules\Taxido\Exports;

use Illuminate\Http\Request;
use Modules\Taxido\Models\Incentive;
use App\Exceptions\ExceptionHandler;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\FromCollection;
use Carbon\Carbon;

class IncentivesExport implements FromCollection, WithMapping, WithHeadings
{
    protected $request;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        if (isDemoModeEnabled()) {
            throw new ExceptionHandler("This action is disabled in demo mode", 400);
        }

        $query = Incentive::with(['driver', 'incentiveLevel.vehicleTypeZone.vehicleType', 'incentiveLevel.vehicleTypeZone.zone']);

        // Apply filters from request
        if ($this->request->driver && !in_array('all', $this->request->driver)) {
            $query->whereIn('driver_id', $this->request->driver);
        }

        if ($this->request->vehicle_type && !in_array('all', $this->request->vehicle_type)) {
            $query->whereHas('incentiveLevel.vehicleTypeZone', function ($q) {
                $q->whereIn('vehicle_type_id', $this->request->vehicle_type);
            });
        }

        if ($this->request->zone && !in_array('all', $this->request->zone)) {
            $query->whereHas('incentiveLevel.vehicleTypeZone', function ($q) {
                $q->whereIn('zone_id', $this->request->zone);
            });
        }

        if ($this->request->period_type && !in_array('all', $this->request->period_type)) {
            $query->whereHas('incentiveLevel', function ($q) {
                $q->whereIn('period_type', $this->request->period_type);
            });
        }

        if ($this->request->level && !in_array('all', $this->request->level)) {
            $query->whereHas('incentiveLevel', function ($q) {
                $q->whereIn('level_number', $this->request->level);
            });
        }

        if ($this->request->start_date && $this->request->end_date) {
            $query->whereBetween('applicable_date', [
                Carbon::parse($this->request->start_date)->startOfDay(),
                Carbon::parse($this->request->end_date)->endOfDay()
            ]);
        }

        if ($this->request->has('is_achieved') && $this->request->is_achieved !== 'all') {
            $query->where('is_achieved', $this->request->is_achieved === '1');
        }

        return $query->orderBy('applicable_date', 'desc')->get();
    }

    public function map($incentive): array
    {
        $vehicleTypeZone = $incentive->incentiveLevel?->vehicleTypeZone;
        $vehicleType = $vehicleTypeZone?->vehicleType;
        $zone = $vehicleTypeZone?->zone;

        return [
            $incentive->id,
            $incentive->driver?->name,
            $incentive->driver?->email,
            $incentive->driver?->phone,
            $vehicleType?->name ?? 'N/A',
            $zone?->name ?? 'N/A',
            ucfirst($incentive->incentiveLevel?->period_type ?? 'N/A'),
            $incentive->incentiveLevel?->level_number ?? 'N/A',
            $incentive->target_rides,
            number_format($incentive->bonus_amount, 2),
            $incentive->applicable_date?->format('Y-m-d'),
            $incentive->is_achieved ? 'Achieved' : 'Pending',
            $incentive->created_at?->format('Y-m-d H:i:s'),
        ];
    }

    /**
     * Get the headings for the export file.
     *
     * @return array
     */
    public function headings(): array
    {
        return [
            'ID',
            'Driver Name',
            'Driver Email',
            'Driver Phone',
            'Vehicle Type',
            'Zone',
            'Period Type',
            'Level',
            'Target Rides',
            'Bonus Amount',
            'Applicable Date',
            'Status',
            'Created At',
        ];
    }
}

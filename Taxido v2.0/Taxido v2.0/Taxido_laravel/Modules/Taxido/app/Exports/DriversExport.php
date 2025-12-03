<?php

namespace Modules\Taxido\Exports;

use Modules\Taxido\Models\Driver;
use App\Exceptions\ExceptionHandler;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\FromCollection;
use Modules\Taxido\Enums\RoleEnum;
use Modules\Taxido\Tables\DriverTable;

class DriversExport implements FromCollection, WithMapping, WithHeadings
{
    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        if (isDemoModeEnabled()) {
            throw new ExceptionHandler("This action is disabled in demo mode", 400);
        }

        $driverTable = new DriverTable(request()->merge([
            'export' => true,
        ]));

        return $driverTable->getData();
    }

    /**
     * Specify the columns for the export.
     *
     * @return array
     */
    public function columns(): array
    {
        return [
            'id',
            'name',
            'email',
            'country_code',
            'phone',
            'profile_image_id',
            'is_online',
            'is_on_ride',
            'is_verified',
            'status',
        ];
    }

    public function map($driver): array
    {
        return [
            $driver->id,
            $driver->name,
            $driver->email,
            $driver->country_code,
            $driver->phone,
            $driver->profile_image?->original_url,
            $driver->is_online,
            $driver->is_on_ride,
            $driver->is_verified,
            $driver->address?->address,
            $driver->address?->city,
            $driver->address?->state,
            $driver->address?->country?->name,
            $driver->status,
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
            'Name',
            'Email',
            'Country Code',
            'Phone',
            'Profile Image',
            'Is Online',
            'Is On Ride',
            'Is Verified',
            'Address',
            'City',
            'State',
            'Country',
            'Status',
        ];
    }
}

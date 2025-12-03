<?php

namespace Modules\Taxido\Exports;

use App\Exceptions\ExceptionHandler;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\FromCollection;
use Modules\Taxido\Tables\DriverDocumentTable;

class DriverDocumentsExport implements FromCollection, WithMapping, WithHeadings
{
    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        if (isDemoModeEnabled()) {
            throw new ExceptionHandler("This action is disabled in demo mode", 400);
        }

        $driverDocumentTable = new DriverDocumentTable(request()->merge([
            'export' => true,
        ]));

        return $driverDocumentTable->getData();
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
            'driver_id',
            'document_id',
            'document_image_id',
            'status',
        ];
    }
    public function map($driverDocument): array
    {
        return [
            $driverDocument->id,
            $driverDocument->driver ? $driverDocument->driver->name : 'N/A',
            $driverDocument->document->pluck('name')->implode(','),
            $driverDocument->document_image?->original_url,
            $driverDocument->status,
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
            'Driver',
            'Document',
            'Document No',
            'Document Image',
            'Status',
        ];
    }

    public function filter($driverDocuments, $request)
    {
        return $driverDocuments->get();
    }
}

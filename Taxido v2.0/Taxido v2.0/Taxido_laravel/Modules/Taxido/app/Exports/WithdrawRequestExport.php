<?php

namespace Modules\Taxido\Exports;

use App\Exceptions\ExceptionHandler;
use Modules\Taxido\Models\WithdrawRequest;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\FromCollection;
use Modules\Taxido\Tables\WithdrawRequestTable;

class WithdrawRequestExport implements FromCollection, WithMapping, WithHeadings
{
    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        if (isDemoModeEnabled()) {
            throw new ExceptionHandler("This action is disabled in demo mode", 400);
        }

        $withdrawRequestTable = new WithdrawRequestTable(request()->merge([
            'export' => true,
        ]));

        return $withdrawRequestTable->getData();
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
            'amount',
            'message',
            'status',
            'payment_type',
        ];
    }

    /**
     * Map each withdraw request to the format required for the export.
     *
     * @param WithdrawRequest $withdrawRequest
     */
    public function map($withdrawRequest): array
    {
        return [
            $withdrawRequest->id,
            $withdrawRequest->driver?->name,
            $withdrawRequest->amount,
            $withdrawRequest->message,
            $withdrawRequest->status,
            $withdrawRequest->payment_type,
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
            'Amount',
            'Message',
            'Status',
            'Payment Type',
        ];
    }

    /**
     * Filter the withdraw requests (optional filtering logic).
     *
     */
    public function filter($withdrawRequests, $request)
    {
        if ($request->has('start_date') && $request->has('end_date')) {
            $withdrawRequests->whereBetween('created_at', [
                $request->input('start_date'),
                $request->input('end_date'),
            ]);
        }
        return $withdrawRequests->get();
    }
}

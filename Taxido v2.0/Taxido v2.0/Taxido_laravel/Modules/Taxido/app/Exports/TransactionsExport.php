<?php

namespace Modules\Taxido\Exports;

use App\Exceptions\ExceptionHandler;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\FromCollection;

class TransactionsExport implements FromCollection, WithMapping, WithHeadings
{

    protected $transactions;

    public function __construct($transactions)
    {
        $this->transactions = $transactions;
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        if (isDemoModeEnabled()) {
            throw new ExceptionHandler("This action is disabled in demo mode", 400);
        }

        return $this->transactions;
    }

    /**
     * Specify the columns for the export.
     *
     * @return array
     */
    public function columns(): array
    {
        return [
           'item_id',
           'payment_method',
           'payment_status',
           'type',
           'amount',
           'transaction_id',
        ];
    }

    public function map($transaction): array
    {

        return [
            $transaction->item_id,
            $transaction->payment_method,
            $transaction->payment_status,
            $transaction->type,
            $transaction->amount,
            $transaction->transaction_id,
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
            'Item Id',
            'Payment Method',
            'Payment Status',
            'Type',
            'Amount',
            'Transaction Id',
        ];
    }

    public function filter($transactions, $request)
    {
        if($request->payment_method) {
            $transactions = $transactions->whereIn('payment_method',$request->payment_method);
        }

        if($request->payment_status) {
            $transactions = $transactions->whereIn('payment_status',$request->payment_status);
        }

        if($request->transaction_type) {
            $transactions = $transactions->whereIn('type',$request->transaction_type);
        }

        if($request->start_end_date)
        {
            $dateRange = explode(' - ', $request->start_end_date);
            $startDate = \Carbon\Carbon::createFromFormat('m/d/Y', trim($dateRange[0]))->startOfDay();
            $endDate = \Carbon\Carbon::createFromFormat('m/d/Y', trim($dateRange[1]))->endOfDay();

            $transactions =  $transactions->whereBetween('created_at', [$startDate, $endDate]);
        }

        return $transactions->get();
    }
}

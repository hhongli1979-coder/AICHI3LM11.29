<?php

namespace Modules\Taxido\Repositories\Admin;

use Exception;
use Carbon\Carbon;
use App\Models\PaymentTransactions;
use App\Exceptions\ExceptionHandler;
use Maatwebsite\Excel\Facades\Excel;
use Modules\Taxido\Exports\TransactionsExport;
use Prettus\Repository\Eloquent\BaseRepository;

class TransactionReportRepository extends BaseRepository
{
    public function model()
    {
        return PaymentTransactions::class;
    }

    public function index()
    {
        return view('taxido::admin.reports.transaction');
    }

    public function filter($request)
    {

        $transactions = $this->model->newQuery();
        if ($request->payment_method && !in_array('all', $request->payment_method)) {
            $transactions = $transactions->whereIn('payment_method', $request->payment_method);
        }

        if ($request->payment_status && !in_array('all', $request->payment_status)) {
            $transactions = $transactions->whereIn('payment_status', $request->payment_status);
        }

        if ($request->transaction_type && !in_array('all', $request->transaction_type)) {
            $transactions = $transactions->whereIn('type', $request->transaction_type);
        }

        if ($request->start_end_date) {
            $dates = explode(' to ', $request->start_end_date);

            if (count($dates) == 2) {
                try {
                    $startDate = Carbon::createFromFormat('m/d/Y', trim($dates[0]))->startOfDay();
                    $endDate = Carbon::createFromFormat('m/d/Y', trim($dates[1]))->endOfDay();

                    $transactions = $transactions->whereBetween('created_at', [$startDate, $endDate]);

                } catch (Exception $e) {
                        throw new ExceptionHandler($e->getMessage(), $e->getCode());
                }
            }
        }

        $transactions = $transactions->latest()->paginate(15);

        $transactionReportTable = $this->getTransactionReportTable($transactions, $request);

        return response()->json([
            'transactionReportTable' => $transactionReportTable,
            'pagination' => $transactions->links('pagination::bootstrap-4')->render(),
        ]);
    }

    public function getTransactionReportTable($transactions, $request)
    {
        $transactionReportTable = "";
        $paymentMethodColorClasses = getPaymentStatusColorClasses();

        if ($transactions->isNotEmpty()) {
            foreach ($transactions as $transaction) {
                $transactionReportTable .= "
                    <tr>
                        <td>{$transaction->transaction_id}</td>
                        <td>{$transaction->payment_method}</td>
                        <td>
                        <div class='badge badge-" . $paymentMethodColorClasses[ucfirst($transaction->payment_status)] . "'>
                        " . ucfirst($transaction->payment_status) . "
                        </div>
                        </td>
                        <td>" . getDefaultCurrency()?->symbol . $transaction->amount . "</td>
                        <td>{$transaction->type}</td>
                        <td>{$transaction->created_at->format('Y-m-d h:i:s A')}</td>
                    </tr>";
            }
        } else {
            $transactionReportTable .= "
                <tr>
                    <td colspan='5' class='text-center'>
                        <div class='no-data'>
                            <img src='" . asset('images/no-data.png') . "' class='img-lg' alt='no-data'>
                            <span>" . __('taxido::static.no_result') . "</span>
                        </div>
                    </td>
                </tr>";
        }

        return $transactionReportTable;
    }

    public function export($request)
    {
        try {

            $query = $this->model->newQuery();
            if ($request->payment_method && !in_array('all', $request->payment_method)) {
                $query->whereIn('payment_method', $request->payment_method);
            }
            if ($request->payment_status && !in_array('all', $request->payment_status)) {
                $query->whereIn('payment_status', $request->payment_status);
            }

            if ($request->transaction_type && !in_array('all', $request->transaction_type)) {
                $query->whereIn('type', $request->transaction_type);
            }


            if ($request->start_end_date) {
                $dates = explode('to', $request->start_end_date);

                if (count($dates) == 2) {
                    try {
                        $startDate = Carbon::createFromFormat('m/d/Y', trim($dates[0]))->startOfDay();
                        $endDate = Carbon::createFromFormat('m/d/Y', trim($dates[1]))->endOfDay();
                        $query->whereBetween('created_at', [$startDate, $endDate]);
                    } catch (Exception $e) {
                        throw new ExceptionHandler($e->getMessage(), $e->getCode());
                    }
                }
            }

            $transactions = $query->latest()->get();
            $allowedFormats = ['xlsx', 'xls', 'csv'];
            $format = $request->input('format', 'xlsx');
            if (!in_array($format, $allowedFormats)) {
                $format = 'xlsx';
            }
            $date = now()->format('Y-m-d');
            $fileName = "transactions_{$date}.{$format}";

            return Excel::download(new TransactionsExport($transactions), $fileName);
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
}

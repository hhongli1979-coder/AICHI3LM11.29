<?php

namespace App\Repositories\Admin;

use Exception;
use App\Models\Country;
use App\Models\Currency;
use Illuminate\Support\Facades\DB;
use App\Exceptions\ExceptionHandler;
use Prettus\Repository\Eloquent\BaseRepository;

class CurrencyRepository extends BaseRepository
{
    protected $countries;

    public function model()
    {
        $this->countries = new Country();
        return Currency::class;
    }

    public function index($currencyTable)
    {
        if (request()['action']) {
            return redirect()->back();
        }

        return view('admin.currency.index', ['tableConfig' => $currencyTable]);
    }

    public function create($attribute = [])
    {
        return view('admin.currency.create', ['code' => $this->countries->pluck('currency_code', 'currency_code')]);
    }

    public function store($request)
    {
        DB::beginTransaction();
        try {
            $currency = $this->model->create([
                'code' => $request->code,
                'flag' => $request->flag,
                'symbol' => $request->symbol,
                'no_of_decimal' => $request->no_of_decimal,
                'exchange_rate' => $request->exchange_rate,
                'status' => $request->status,
            ]);

            DB::commit();
            if ($request->has('save')) {
                return to_route('admin.currency.edit', ['currency' => $currency->id])
                        ->with('success', __('static.currencies.create_successfully'));
            }

            return to_route('admin.currency.index')->with('success', __('static.currencies.create_successfully'));
        } catch (Exception $e) {
            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function edit(Currency $currency)
    {
        return view('admin.currency.edit', [
            'code' => $this->countries->pluck('currency_code', 'currency_code'),
            'currency' => $currency,
        ]);
    }

    public function update($request, $id)
    {
        DB::beginTransaction();
        try {

            $currency = $this->model->findOrFail($id);
            $currency->update($request);

            DB::commit();
            if (array_key_exists('save', $request)) {
                return to_route('admin.currency.edit', ['currency' => $currency->id])
                    ->with('success', __('static.currencies.update_successfully'));
            }

            return to_route('admin.currency.index')->with('success', __('static.currencies.update_successfully'));
        } catch (Exception $e) {

            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function destroy($id)
    {
        try {

            if ($this->model->count() <= 1) {
                throw new Exception('You cannot delete the last remaining currency.');
            }

            $currency = $this->model->findOrFail($id);
            $currency->destroy($id);

            return to_route('admin.currency.index')->with('success', __('static.currencies.delete_successfully'));
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function status($id, $status)
    {
        try {

            $currency = $this->model->findOrFail($id);
            $currency->update(['status' => $status]);

            return json_encode(["resp" => $currency]);
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function restore($id)
    {
        try {

            $currency = $this->model->onlyTrashed()->findOrFail($id);
            $currency->restore();

            return redirect()->back()->with('success', __('static.currencies.restore_successfully'));
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function forceDelete($id)
    {
        try {

            $currency = $this->model->onlyTrashed()->findOrFail($id);
            $currency->forceDelete();
            return redirect()->back()->with('success', __('static.currencies.permanent_delete_successfully'));
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function getSymbol($request)
    {
        $country = Country::where('currency_code', $request->code)->first();
        return response()->json(['symbol' => $country?->currency_symbol ?? '']);
    }
}

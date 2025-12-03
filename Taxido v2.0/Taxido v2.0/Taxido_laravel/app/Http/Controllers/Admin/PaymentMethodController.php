<?php

namespace App\Http\Controllers\Admin;

use Exception;
use Illuminate\Http\Request;
use Nwidart\Modules\Facades\Module;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Artisan;
use Jackiedo\DotenvEditor\Facades\DotenvEditor;

class PaymentMethodController extends Controller
{
    public function index()
    {
        $paymentMethods = getPaymentMethodConfigs();
        return view('admin.payment-method.index', ['paymentMethods' => $paymentMethods]);
    }
    
    public function update(Request $request, $payment)
    {
        try {

            $configs = null;
            $title = $request->title ?? null;
            $paymentGatewayCharge = $request->processing_fee ?? 0;
            $Subscription = $request->subscription ?? 0;
            $paymentMethods = getPaymentMethodConfigs();
            $paymentFile = module_path($payment, 'config/payment.php');
            if (file_exists($paymentFile)) {
                $paymentConfig = include $paymentFile;

                $paymentConfig['title'] = $title;
                $paymentConfig['subscription'] = $Subscription;
                $paymentConfig['processing_fee'] = $paymentGatewayCharge;
                $content = "<?php\n\nreturn ".var_export($paymentConfig, true).";\n";
                File::put($paymentFile, $content);
                Artisan::call('cache:clear');
            }

            foreach ($paymentMethods as $paymentMethod) {
                if ($paymentMethod['slug'] == $payment) {
                    $configs = $paymentMethod;
                }
            }

            if ($configs) {
                foreach ($configs['fields'] as $fieldKey => $fieldAttributes) {
                    $envKey = strtoupper($fieldKey);
                    $newValue = decryptKey($request->$fieldKey);
                    DotenvEditor::setKey($envKey, $newValue);
                    DotenvEditor::save();
                }

                return to_route('admin.payment-method.index');
            }

            return redirect()->back()->with('error', __('static.payment_methods.config_file_not_found'));

        } catch (Exception $e) {

            return redirect()->back()->with('error', __('static.payment_methods.something_went_wrong'));
        }
    }

    public function status(Request $request, $payment)
    {
        try {

            $paymentMethods = getPaymentMethodConfigs();
            foreach ($paymentMethods as $paymentMethod) {
                if ($paymentMethod['slug'] == $payment) {
                    if (Module::has($paymentMethod['name'])) {
                        if ((int) $request->status) {
                            Module::enable($paymentMethod['name']);
                        } else {
                            Module::disable($paymentMethod['name']);
                        }

                        return response()->json([
                            'message' => __('static.payment_methods.updated_msg', ['name' => $paymentMethod['name']]),
                            'success' => true,
                        ], 200);
                    }
                }
            }

            return response()->json(['error' => __('static.payment_methods.invalid_msg')], 400);

        } catch (Exception $e) {

            return response()->json(['error' => __('static.something_went_wrong')], 500);
        }
    }
}

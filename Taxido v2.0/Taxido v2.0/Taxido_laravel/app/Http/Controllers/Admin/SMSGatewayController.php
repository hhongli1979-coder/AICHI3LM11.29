<?php

namespace App\Http\Controllers\Admin;

use Exception;
use Illuminate\Http\Request;
use Nwidart\Modules\Facades\Module;
use App\Http\Controllers\Controller;
use Jackiedo\DotenvEditor\Facades\DotenvEditor;

class SMSGatewayController extends Controller
{
    public function index()
    {
        $smsGateways = getSMSGatewayConfigs();
        return view('admin.sms-gateways.index', ['smsGateways' => $smsGateways]);
    }

    public function update(Request $request, $sms)
    {
        try {

            $smsGateways = getSMSGatewayConfigs();
            $configs = null;
            foreach ($smsGateways as $smsGateway) {
                if ($smsGateway['slug'] == $sms) {
                    $configs = $smsGateway;
                }
            }

            if ($configs) {
                DotenvEditor::addEmpty();
                foreach ($configs['fields'] as $fieldKey => $fieldAttributes) {
                    $envKey = strtoupper($fieldKey);
                    $newValue = $request->$fieldKey;
                    DotenvEditor::setKey($envKey, $newValue);
                    DotenvEditor::save();
                }

                return to_route('admin.sms-gateway.index');
            }

            return redirect()->back()->with('error', __('static.sms_gateways.config_file_not_found'));

        } catch (Exception $e) {

            return redirect()->back()->with('error', __('static.sms_gateways.something_went_wrong'));
        }
    }

    public function status(Request $request, $sms)
    {
        try {

            $smsGateways = getSMSGatewayConfigs();
            foreach ($smsGateways as $smsGateway) {
                if ($smsGateway['slug'] == $sms) {
                    if (Module::has($smsGateway['name'])) {
                        if ((int) $request->status) {
                            Module::enable($smsGateway['name']);
                        } else {
                            Module::disable($smsGateway['name']);
                        }

                        return response()->json([
                            'message' => __('static.sms_gateways.updated_msg', ['name' => $smsGateway['name']]),
                            'success' => true,
                        ], 200);
                    }
                }
            }

            return response()->json(['error' => __('static.sms_gateways.invalid_msg')], 400);

        } catch (Exception $e) {

            return response()->json(['error' => __('static.something_went_wrong')], 500);
        }
    }
}

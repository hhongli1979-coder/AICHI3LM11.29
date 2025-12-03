<?php

namespace Modules\Taxido\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Modules\Taxido\Models\IncentiveLevel;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class SaveIncentiveConfigurationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'vehicle_type_id' => 'required|integer|exists:vehicle_types,id',
            'zone_id' => 'required|integer|exists:zones,id',
            'period_type' => 'required|in:daily,weekly',
            'levels' => 'required|array|min:1|max:5',
            'levels.*.level_number' => 'required|integer|min:1|max:5',
            'levels.*.target_rides' => 'required|integer|min:1|max:1000',
            'levels.*.incentive_amount' => 'required|numeric|min:0.01|max:99999.99',
        ];
    }

    /**
     * Get custom error messages for validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'vehicle_type_id.required' => 'Vehicle type is required',
            'vehicle_type_id.integer' => 'Vehicle type must be a valid number',
            'vehicle_type_id.exists' => 'Selected vehicle type does not exist',
            'zone_id.required' => 'Zone is required',
            'zone_id.integer' => 'Zone must be a valid number',
            'zone_id.exists' => 'Selected zone does not exist',
            'period_type.required' => 'Period type is required',
            'period_type.in' => 'Period type must be either daily or weekly',
            'levels.required' => 'At least one incentive level is required',
            'levels.array' => 'Levels must be provided as an array',
            'levels.min' => 'At least one incentive level is required',
            'levels.max' => 'Maximum 5 incentive levels are allowed',
            'levels.*.level_number.required' => 'Level number is required for each level',
            'levels.*.level_number.integer' => 'Level number must be a valid number',
            'levels.*.level_number.min' => 'Level number must be at least 1',
            'levels.*.level_number.max' => 'Level number cannot exceed 5',
            'levels.*.target_rides.required' => 'Target rides is required for each level',
            'levels.*.target_rides.integer' => 'Target rides must be a valid number',
            'levels.*.target_rides.min' => 'Target rides must be at least 1',
            'levels.*.target_rides.max' => 'Target rides cannot exceed 1000',
            'levels.*.incentive_amount.required' => 'Incentive amount is required for each level',
            'levels.*.incentive_amount.numeric' => 'Incentive amount must be a valid number',
            'levels.*.incentive_amount.min' => 'Incentive amount must be at least 0.01',
            'levels.*.incentive_amount.max' => 'Incentive amount cannot exceed 99999.99',
        ];
    }

    /**
     * Configure the validator instance.
     *
     * @param  \Illuminate\Validation\Validator  $validator
     * @return void
     */
    public function withValidator(Validator $validator)
    {
        $validator->after(function ($validator) {
            // Validate progressive target rides
            if ($this->has('levels')) {
                $progressiveErrors = IncentiveLevel::validateProgressiveTargets($this->input('levels'));

                foreach ($progressiveErrors as $field => $message) {
                    $validator->errors()->add($field, $message);
                }
            }

            // Validate unique level numbers
            if ($this->has('levels')) {
                $levelNumbers = collect($this->input('levels'))->pluck('level_number')->toArray();
                $uniqueLevelNumbers = array_unique($levelNumbers);

                if (count($levelNumbers) !== count($uniqueLevelNumbers)) {
                    $validator->errors()->add('levels', 'Each level number must be unique');
                }
            }
        });
    }

    /**
     * Handle a failed validation attempt.
     *
     * @param  \Illuminate\Contracts\Validation\Validator  $validator
     * @return void
     *
     * @throws \Illuminate\Http\Exceptions\HttpResponseException
     */
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422)
        );
    }
}

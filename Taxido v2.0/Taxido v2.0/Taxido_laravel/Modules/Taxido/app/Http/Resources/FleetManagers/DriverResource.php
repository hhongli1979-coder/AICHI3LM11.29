<?php

namespace Modules\Taxido\Http\Resources\FleetManagers;

use Illuminate\Http\Request;
use App\Http\Resources\BaseResource;

class DriverResource  extends BaseResource
{
    protected $showSensitiveAttributes = true;

    public static $wrap = null;

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */

    public function toArray(Request $request): array
    {
        $status = $this->resolveVerificationStatus();

        $driver = [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'profile_image_url' => $this->profile_image?->original_url,
            'service_id' => $this->service_id,
            'service_category_id' => $this->service_category_id,
            'country_code' => $this->country_code,
            'phone' => $this->phone,
            'vehicle_info_id' => $this->vehicle_info?->id,
            'wallet_balance' => $this->wallet?->balance,
            'currency_symbol' => $this->address?->country?->currency_symbol,
            'rating_count' => $this->rating_count,
            'review_count' => $this->review_count,
            'status' => $status,
            'documents' => null,
        ];

        if($this->documents) {
            $driver['documents'] = FleetDocumentResource::collection($this->documents);
        }

        return $driver;
    }

    protected function resolveVerificationStatus(): string
    {
        $docs = $this->documents;
        if ($docs === null) {
            $docs = $this->documents()->select('status')->get();
        }

        if ($docs->isEmpty()) {
            return 'pending';
        }

        $hasRejected = $docs->contains(function ($doc) {
            return strtolower((string) $doc->status) === 'rejected';
        });
        if ($hasRejected) {
            return 'rejected';
        }

        $hasPending = $docs->contains(function ($doc) {
            return strtolower((string) $doc->status) === 'pending';
        });
        if ($hasPending) {
            return 'pending';
        }

        return 'approved';
    }
}

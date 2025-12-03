<?php

namespace Modules\Taxido\Http\Resources\FleetManagers;

use Illuminate\Http\Request;
use App\Http\Resources\BaseResource;

class VehicleInfoResource  extends BaseResource
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

        $vehicleInfo = [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'color' => $this->color,
            'vehicle_type_image_url' => $this->vehicle?->vehicle_image?->original_url,
            'plate_number' => $this->plate_number,
            'vehicle_type_id' => $this->vehicle_type_id,
            'driver_id' => $this->driver_id,
            'fleet_manager_id' => $this->fleet_manager_id,
            'model' => $this->model,
            'model_year' => $this->model_year,
            'status' => $status,
            'driver' => null,
            'documents' => null,
        ];

        if($this->driver) {
            $vehicleInfo['driver'] = [
                'id' => $this->driver?->id,

                'name' => $this->driver?->name,
                'profile_image_url' => $this->driver?->profile_image?->original_url,
            ];
        }

        if($this->documents) {
            $vehicleInfo['documents'] = FleetDocumentResource::collection($this->documents);
        }

        return $vehicleInfo;
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

        // All approved
        return 'approved';
    }
}

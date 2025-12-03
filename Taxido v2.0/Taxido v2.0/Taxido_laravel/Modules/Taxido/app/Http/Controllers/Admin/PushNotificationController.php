<?php

namespace Modules\Taxido\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Modules\Taxido\Models\PushNotification;
use Modules\Taxido\Tables\PushNotificationTable;
use Modules\Taxido\Repositories\Admin\PushNotificationRepository;
use Modules\Taxido\Http\Requests\Admin\CreatePushNotificationRequest;

class PushNotificationController extends Controller
{
    protected $repository;

    public function __construct(PushNotificationRepository $repository)
    {
        $this->authorizeResource(PushNotification::class, 'push_notification');
        $this->repository = $repository;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(PushNotificationTable $pushNotificationTable)
    {
        return $this->repository->index($pushNotificationTable->generate());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        return $this->repository->create($request->all());
    }

    public function sendNotification(CreatePushNotificationRequest $request)
    {
        return $this->repository->sendNotification($request);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PushNotification $pushNotification)
    {
        return $this->repository->destroy($pushNotification->id);
    }

    /**
     * Restore the specified resource from storage.
     */
    public function restore($id)
    {
        return $this->repository->restore($id);
    }

    /**
     * Permanent delete the specified resource from storage.
     */
    public function forceDelete($id)
    {
        return $this->repository->forceDelete($id);
    }

    public function status(Request $request, $id)
    {
        return $this->repository->status($id, $request->status);
    }

    public function scheduleStatus(){
        return $this->repository->scheduleStatus();
    }
}

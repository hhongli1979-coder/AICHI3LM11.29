<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Repositories\Api\NotificationRepository;

class NotificationController extends Controller
{

    protected $repository;

    public function __construct(NotificationRepository $repository)
    {
        $this->repository = $repository;
    }
    /**
     * Display a listing of the resource.
     */

    public function index(Request $request)
    {
        $user = $this->repository->findOrFail(getCurrentUserId());
        return $user->notifications()->latest('created_at')->simplePaginate($request->paginate ?? $user->count() ?: null);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function markAsRead(Request $request)
    {
        return $this->repository->markAsRead($request);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        return $this->repository->destroy($request->id);
    }
}

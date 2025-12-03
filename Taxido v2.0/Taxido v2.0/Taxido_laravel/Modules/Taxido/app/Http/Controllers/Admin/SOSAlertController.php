<?php

namespace Modules\Taxido\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Modules\Taxido\Tables\SOSAlertTable;
use Modules\Taxido\Repositories\Admin\SOSAlertRepository;

class SOSAlertController extends Controller
{
    protected $repository;

    public function __construct(SOSAlertRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Display the SOS alerts index page.
     */
    public function index(SOSAlertTable $sosAlertTable)
    {
        return $this->repository->index($sosAlertTable->generate());
    }

    /**
     * Display the details of a specific SOS alert.
     */
    public function show($id)
    {
        $sosAlert = $this->repository->getById($id);
        $ride     = $sosAlert->ride;
        return view('taxido::admin.sos-alert.show', compact('sosAlert', 'ride'));
    }

    /**
     * Update the status of an SOS alert.
     */
    public function updateStatus(Request $request, $id)
    {
        $sos = $this->repository->updateStatus($id, $request->status);
        if ($sos) {
            return redirect()->back()->with('success', 'SOS status updated successfully.');
        }
        return redirect()->back()->with('error', 'Failed to update SOS status.');
    }
}

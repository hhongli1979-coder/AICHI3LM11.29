<?php

namespace Modules\Taxido\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Modules\Taxido\Models\CabCommissionHistory;
use Modules\Taxido\Tables\CabCommissionHistoryTable;
use Modules\Taxido\Repositories\Admin\CabCommissionHistoryRepository;

class CabCommissionHistoryController extends Controller
{
    public $repository;

    public function __construct(CabCommissionHistoryRepository $repository)
    {
        $this->authorizeResource(CabCommissionHistory::class, 'cab_commission_history');
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(CabCommissionHistoryTable $cabCommissionHistoryTable)
    {
        return $this->repository->index($cabCommissionHistoryTable->generate());
    }
}

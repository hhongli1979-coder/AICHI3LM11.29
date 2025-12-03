<?php

namespace Modules\Ticket\Repositories\Api;

use Exception;
use App\Exceptions\ExceptionHandler;
use Modules\Ticket\Models\Department;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

class DepartmentRepository extends BaseRepository
{
    public function model()
    {
        return Department::class;
    }

    /**
     * Initialize the repository and apply any global criteria.
     */
    public function boot()
    {
        try {
            $this->pushCriteria(app(RequestCriteria::class));
        } catch (Exception $e) {
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    /**
     * Get a single department by ID.
     */
    public function show($id)
    {
        try {
            return $this->model->findOrFail($id);
        } catch (Exception $e) {
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
}

<?php

namespace Modules\Taxido\Repositories\Api;

use Exception;
use App\Exceptions\ExceptionHandler;
use Modules\Taxido\Models\DriverRule;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

class DriverRuleRepository extends BaseRepository
{
    protected $fieldSearchable = [
        'title' => 'like'
    ];

    function model()
    {
        return DriverRule::class;
    }

    public function  boot()
    {
        try {

            $this->pushCriteria(app(RequestCriteria::class));

        } catch (Exception $e) {
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function show($id)
    {
        try {

            return $this->model->findOrFail($id);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
}

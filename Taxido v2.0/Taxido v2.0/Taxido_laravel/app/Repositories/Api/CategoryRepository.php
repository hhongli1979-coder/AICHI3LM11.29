<?php

namespace App\Repositories\Api;

use Exception;
use App\Models\Category;
use App\Exceptions\ExceptionHandler;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

Class CategoryRepository extends BaseRepository
{

    protected $fieldSearchable = [
        'name' => 'like'
    ];

    function model()
    {
        return Category::class;
    }

    public function boot()
    {
        try{

            $this->pushCriteria(app(RequestCriteria::class));

        }catch(Exception $e)
        {
            throw new ExceptionHandler($e->getMessage(),$e->getcode());
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

    public function getCategoryBySlug($slug)
    {
        try {

            return $this->model->where('slug', $slug)->firstOrFail();

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
    
}
<?php

namespace App\Repositories\Api;

use Exception;
use App\Models\Page;
use App\Exceptions\ExceptionHandler;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

class PageRepository extends BaseRepository
{

    protected $fieldSearchable = [
        'title' => 'like',
    ];

    public function boot()
    {
        try {

            $this->pushCriteria(app(RequestCriteria::class));

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    function model()
    {
        return Page::class;
    }

    public function show($id)
    {
        try {

            return $this->model->findOrFail($id);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
    
    public function getPagesBySlug($slug)
    {
        try {

            $page = $this->model
                ->where('slug', $slug)->firstOrFail()
                ->makeVisible(['content', 'meta_description']);

            isset($page->created_by)?
                $page->created_by->makeHidden(['permission']): $page;

            return $page;

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
}

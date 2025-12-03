<?php

namespace App\Repositories\Api;

use Exception;
use App\Models\Blog;
use App\Exceptions\ExceptionHandler;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

class BlogRepository extends BaseRepository
{
    protected $fieldSearchable =
    [
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
        return Blog::class;
    }

    public function show($id)
    {
        try {

            return $this->model->findOrFail($id);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function getBlogBySlug($slug)
    {
        try {

            $blog = $this->model->where('slug', $slug)->firstOrFail()
                ->makeVisible(['content', 'meta_description']);

            isset($blog->created_by)?
                $blog->created_by->makeHidden(['permission']): $blog;

            return $blog;

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
}
<?php

namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;
use App\Repositories\Front\BlogRepository;

class BlogController extends Controller
{
    public $repository;

    public function __construct(BlogRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getBlogBySlug($slug)
    {
        return $this->repository->getBlogBySlug($slug);
    }

    public function index()
    {
        return $this->repository->index();
    }
}
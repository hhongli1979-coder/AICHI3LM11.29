<?php

namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;
use App\Repositories\Front\PageRepository;

class PageController extends Controller
{
    public $repository;

    public function __construct(PageRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getPageBySlug($slug)
    {
        return $this->repository->getPageBySlug($slug);
    }

    public function index()
    {
        return $this->repository->index();
    }
}
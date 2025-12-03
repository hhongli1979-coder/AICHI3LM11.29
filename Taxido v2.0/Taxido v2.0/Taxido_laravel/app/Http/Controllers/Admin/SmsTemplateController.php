<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Repositories\Admin\SmsTemplateRepository;

class SmsTemplateController extends Controller
{
    protected $repository;

    public function __construct(SmsTemplateRepository $repository)
    {
      
        $this->repository = $repository;
    }

    public function index(Request $request)
    {
        return $this->repository->index($request);
    }
    
    public function edit(Request $request , $slug)
    {
        return $this->repository->edit($request->all(),$slug);
    }

    public function update(Request $request , $slug)
    {
        return $this->repository->update($request->all(),$slug);
    }
}

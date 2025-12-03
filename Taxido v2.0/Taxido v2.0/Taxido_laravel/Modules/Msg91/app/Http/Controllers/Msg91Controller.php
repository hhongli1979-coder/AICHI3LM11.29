<?php

namespace Modules\Msg91\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class Msg91Controller extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return view('msg91::index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('msg91::create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Show the specified resource.
     */
    public function show($id)
    {
        return view('msg91::show');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return view('msg91::edit');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        //
    }
}

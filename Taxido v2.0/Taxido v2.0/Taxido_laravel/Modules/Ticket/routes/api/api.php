<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Api Routes
|--------------------------------------------------------------------------
|
| Here is where you can register api routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "api" middleware group. Now create something great!
|
*/


// Priority
Route::apiResource('priority', 'PriorityController', ['only' => ['index', 'show']]);

// Department
Route::apiResource('department', 'DepartmentController', ['only' => ['index', 'show']]);

Route::group(['middleware' => ['auth:sanctum', 'localization'], 'as' => 'api.'], function () {

    Route::post('ticket', 'TicketController@store');
    Route::post('ticket/reply', 'TicketController@reply');
    Route::get('tickets', 'TicketController@index');
    Route::get('ticket/{ticket}', 'TicketController@show')->name('ticket.show');
    
});


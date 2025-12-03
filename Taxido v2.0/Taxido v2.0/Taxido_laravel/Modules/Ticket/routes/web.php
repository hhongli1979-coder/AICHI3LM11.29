<?php

use Illuminate\Support\Facades\Route;


/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::group(['middleware' => ['localization' , 'maintenance'], 'namespace' => 'Front'], function () {

  Route::get('ticket', 'TicketController@create')->name('ticket.form');
  Route::post('ticket', 'TicketController@store')->name('ticket.store');
});

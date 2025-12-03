<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateRobotRequest;

class RobotsController extends Controller
{
    public function index()
    {

        $filePath = public_path('robots.txt');
        $content = file_exists($filePath) ? file_get_contents($filePath) : '';

        return view('admin.appearance.robots', ['content' => $content]);
    }
   public function update(UpdateRobotRequest $request)
    {
        $filePath = public_path('robots.txt');
        file_put_contents($filePath, $request->input('content'));

        return redirect()->route('admin.robot.index')->with('success', 'Robots.Txt Updated Successfully!');
    }
}

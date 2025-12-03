<?php

namespace App\Repositories\Api;

use App\Models\Setting;
use Prettus\Repository\Eloquent\BaseRepository;

class SettingRepository extends BaseRepository
{
    function model()
    {
        return Setting::class;
    }

    public function index()
    {
        return $this->model->latest('created_at')->first();
    }
}

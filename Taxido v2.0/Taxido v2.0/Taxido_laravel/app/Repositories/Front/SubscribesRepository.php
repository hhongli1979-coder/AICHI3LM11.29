<?php

namespace App\Repositories\Front;

use Exception;
use App\Models\Subscribes;
use Illuminate\Support\Facades\DB;
use App\Exceptions\ExceptionHandler;
use App\Notifications\NewsletterSubscribed;
use Prettus\Repository\Eloquent\BaseRepository;

class SubscribesRepository extends BaseRepository
{
  function model()
  {
    return Subscribes::class;
  }

  public function store($request)
  {
    DB::beginTransaction();
    try {

      $subscribes = $this->model->where('email', $request->email)?->first();
      if ($subscribes) {
        throw new Exception('This email is already subscribed.', 400);
      }

      $subscriber = $this->model->create([
        'email' => $request->email,
      ]);

      DB::commit();
      $subscriber->notify(new NewsletterSubscribed($subscriber->email));

      return redirect()->back()->with('success', __('static.list'));

    } catch (Exception $e) {

      DB::rollBack();
      throw new ExceptionHandler($e->getMessage(), $e->getCode());
    }
  }
}

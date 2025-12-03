<?php
namespace App\Tables;

use App\Models\Subscribes;
use Illuminate\Http\Request;


class SubscribesTable
{
  protected $subscribe;
  protected $request;


  public function __construct(Request $request)
  {
    $this->subscribe = new Subscribes();
    $this->request = $request;
  }
  public function getData()
  {
    $subscribes = $this->subscribe;

    if ($this->request->has('s')) {
      return $subscribes->where('email', 'LIKE', "%" . $this->request->s . "%")?->paginate($this->request?->paginate);
    }

    if ($this->request->has('orderby') && $this->request->has('order')) {
      return $subscribes->orderBy($this->request->orderby, $this->request->order)->paginate($this->request?->paginate);
    }

    return $subscribes->paginate($this->request?->paginate);

  }

  public function generate()
  {
    $subscribes = $this->getData();

    $subscribes->each(function ($subscribe) {
      $subscribe->date = $subscribe->created_at->format('Y-m-d h:i:s A');
      $subscribe->date = formatDateBySetting($subscribe->created_at);

    });

    $tableConfig = [
      'columns' => [
        ['title' => 'Email', 'field' => 'email', 'imageField' => null, 'action' => false, 'sortable' => true],
        ['title' => 'Created At', 'field' => 'date', 'sortable' => false],
      ],
      'data' => $subscribes,
      'actions' => [],
      'filters' => [],
      'bulkactions' => [],
      'total' => $this->subscribe->count(),
    ];

    return $tableConfig;
  }
}

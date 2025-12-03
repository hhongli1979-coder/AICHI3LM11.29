<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CustomResourceCollection extends AnonymousResourceCollection
{
  /**
   * Add the pagination information to the response.
   *
   * @param  Request  $request
   * @param  array  $paginated
   * @param  array  $default
   * @return array
   */
  public function paginationInformation($request, $paginated, $default)
  {
    unset($paginated['data']);
    unset($paginated['links']);
    unset($paginated['first_page_url']);
    unset($paginated['current_page_url']);
    unset($paginated['next_page_url']);
    unset($paginated['path']);
    unset($paginated['to']);
    unset($paginated['per_page']);
    unset($paginated['prev_page_url']);
    return $paginated;
  }
}

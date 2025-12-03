<?php

// app/Services/BadgeResolver.php
namespace App\Services;

use Closure;
use Illuminate\Support\Facades\Auth;

class BadgeResolver
{
  protected $handlers = [];

  /**
   * Register a badge handler for a specific menu slug.
   *
   * @param string $slug
   * @param Closure $handler
   * @return void
   */
  public function register(string $slug, Closure $handler): void
  {
    $this->handlers[$slug] = $handler;
  }

  /**
   * Get badge count for a menu item slug.
   *
   * @param string $slug
   * @param mixed $user
   * @return int
   */
  public function getBadge(string $slug, $user = null): int
  {
    $user = $user ?? Auth::user();
    if (!$user || !isset($this->handlers[$slug])) {
      return 0;
    }

    return call_user_func($this->handlers[$slug], $user);
  }
}

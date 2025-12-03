<?php

namespace App\Services;

class WidgetManager
{
  protected $widgets = [];

  /**
   * Register a dashboard widget.
   *
   * @param string $id Unique identifier for the widget.
   * @param string $name Display name of the widget.
   * @param callable $callback Render callback for the widget.
   * @param array $options Additional options (e.g., 'context', 'priority', 'data').
   */
  public function registerWidget(string $id, string $name, callable $callback, array $options = [])
  {
    $this->widgets[] = array_merge([
      'id'       => $id,
      'name'     => $name,
      'callback' => $callback,
      'context'  => 'normal',
      'priority' => 'core',   // Default priority
      'data'     => [],
    ], $options);
  }

  /**
   * Get all widgets, sorted by priority.
   */
  public function getWidgets()
  {
    usort($this->widgets, function ($a, $b) {
      $priorities = ['high' => 1, 'core' => 2, 'low' => 3];
      return $priorities[$a['priority']] <=> $priorities[$b['priority']];
    });

    return $this->widgets;
  }
}

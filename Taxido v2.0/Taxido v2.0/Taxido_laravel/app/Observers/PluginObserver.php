<?php

namespace App\Observers;

use App\Models\Plugin;
use Illuminate\Support\Str;
use Nwidart\Modules\Facades\Module;

class PluginObserver
{
    /**
     * Handle the before a record has been created.
     */
    public function creating(Plugin $plugin): void
    {
        $plugin->slug = $plugin->slug ?? Str::slug($plugin->name);
    }

    /**
     * Handle the Plugin "created" event.
     */
    public function created(Plugin $plugin): void
    {
        //
    }

    /**
     * Handle the Plugin "updated" event.
     */
    public function updated(Plugin $plugin): void
    {
        $plugin->menuItems()?->update([
            'status' => $plugin->status
        ]);
        if (Module::has($plugin->name)) {
            if ($plugin->status) {
                Module::enable($plugin->name);
            } else {
                Module::disable($plugin->name);
            }
        }
    }

    /**
     * Handle the Plugin "deleted" event.
     */
    public function deleted(Plugin $plugin): void
    {
        $plugin->menuItems()?->delete();
    }

    /**
     * Handle the Plugin "restored" event.
     */
    public function restored(Plugin $plugin): void
    {
        $plugin->menuItems()?->restore();
    }

    /**
     * Handle the Plugin "force deleted" event.
     */
    public function forceDeleted(Plugin $plugin): void
    {
        $plugin->menuItems()?->forceDelete();
    }
}

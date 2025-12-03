<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class RefreshData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'data:refresh';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Refreshing data...';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->call('db:wipe');
        $this->info('Importing dummy data...');
        $this->call('dummy:import');
        $this->call('optimize:clear');
        $this->call('storage:link');
    }
}

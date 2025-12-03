<?php

namespace Modules\Ticket\Console;

use Carbon\Carbon;
use Illuminate\Console\Command;
use Modules\Ticket\Models\Ticket;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputArgument;

class UpdateDateCommand extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'ticket:date-update';

    /**
     * The console command description.
     */
    protected $description = 'Command description.';

    /**
     * Create a new command instance.
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        Ticket::whereNull('deleted_at')?->update([
            'created_at' => Carbon::now()?->subDays(rand(1, 2))
        ]);

        $this->info('ticket date updated successfully.');
    }

    /**
     * Get the console command arguments.
     */
    protected function getArguments(): array
    {
        return [
            ['example', InputArgument::REQUIRED, 'An example argument.'],
        ];
    }

    /**
     * Get the console command options.
     */
    protected function getOptions(): array
    {
        return [
            ['example', null, InputOption::VALUE_OPTIONAL, 'An example option.', null],
        ];
    }
}

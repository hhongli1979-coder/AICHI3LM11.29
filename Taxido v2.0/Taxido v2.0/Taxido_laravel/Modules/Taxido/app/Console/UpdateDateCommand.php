<?php

namespace Modules\Taxido\Console;

use Carbon\Carbon;
use Illuminate\Console\Command;
use Modules\Taxido\Models\Ride;
use Modules\Taxido\Models\RideRequest;
use Modules\Taxido\Enums\ServiceCategoryEnum;
use Modules\Taxido\Models\CabCommissionHistory;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputArgument;

class UpdateDateCommand extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'taxido:date-update';

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
        $rides = Ride::whereNull('deleted_at')?->get();
        $rideRequests = RideRequest::whereNull('deleted_at')?->get();
        foreach($rides as $ride) {
            if($ride?->service_category?->slug != ServiceCategoryEnum::SCHEDULE) {
                $ride->created_at = Carbon::now()?->subDays(rand(1, 2));
                $ride->save();
                CabCommissionHistory::where('ride_id', $ride?->id)->update([
                   'created_at' => $ride?->created_at
                ]);

            } else {
                $ride->created_at = Carbon::now()?->addDays(rand(1, 2));
                $ride->save();
            }
        }

        foreach($rideRequests as $rideRequest) {
            if($rideRequest?->service_category?->slug != ServiceCategoryEnum::SCHEDULE) {
                $rideRequest->created_at = Carbon::now()?->subDays(rand(1, 2));
                $rideRequest->save();
            } else {
                $ride->created_at = Carbon::now()?->addDays(rand(1, 2));
                $ride->save();
            }
        }

        $this->info('taxido date updated successfully.');
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

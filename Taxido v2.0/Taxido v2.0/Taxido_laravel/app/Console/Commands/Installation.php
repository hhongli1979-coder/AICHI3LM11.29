<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class Installation extends Command
{
    protected $hidden = false;

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'web:install';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Installs the application with optional dummy data.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->line('');
        $this->info('🔧 ----------------------------------------------');
        $this->info('🔧 '.env('APP_NAME').' Installation & Setup');
        $this->info('🔧 ----------------------------------------------');

        $this->line('');
        $this->warn('⚠️  WARNING: This process will ERASE all existing data.');
        $this->line("\033[33mIf you have previously run this command or migrated tables,\033[0m");
        $this->line("\033[33mall of your current data will be lost.\033[0m");

        $this->line('');

        if ($this->confirm('❓ Do you want to continue the installation?')) {
            $this->line('');
            $this->info('🚀 Starting installation...');

            $this->line('');
            if ($this->confirm('📦 Do you want to import dummy/demo data?')) {
                $this->line('');
                $this->warn('⛔ Dropping all existing tables...');
                $this->callSilent('db:wipe');
                $this->info('✅ Database wiped successfully.');

                $this->line('');
                $this->info('📥 Importing dummy data...');
                $this->call('dummy:import');
                $this->info('✅ Dummy data imported successfully!');
            } else {
                $this->line('');
                $this->info('🛠️ Running fresh migrations...');
                $this->call('migrate:fresh');
                $this->info('✅ Tables migrated successfully.');

                $this->line('');
                $this->info('👤 Seeding administrator credentials...');
                $this->call('db:seed');

                $this->line('');
                $this->info('📦 Seeding all modules...');
                $this->call('module:seed', ['--all' => true]);

                $this->info('✅ Seed completed successfully!');
            }

            $this->line('');
            $this->info('🎉 ----------------------------------------------');
            $this->info('🎉 '.env('APP_NAME').' Setup Successfully!');
            $this->info('🎉 ----------------------------------------------');
        } else {
            $this->line('');
            $this->error('❌ Installation aborted by user.');
        }
    }
}

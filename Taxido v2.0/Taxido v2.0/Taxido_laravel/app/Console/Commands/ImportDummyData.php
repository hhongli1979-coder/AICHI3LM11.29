<?php

namespace App\Console\Commands;

use ZipArchive;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class ImportDummyData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dummy:import';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import dummy data including database and demo images.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->line('');
        $this->info('📦 Importing Dummy Data');
        $this->line('--------------------------------------------------');

        $sql = public_path('db.sql');
        if (!file_exists($sql)) {
            $this->error('❌ SQL file not found at: ' . $sql);
            return;
        }

        $this->info('📄 Importing database structure & content from: ' . $sql);
        try {
            $data = file_get_contents($sql);
            DB::unprepared($data);
            $this->info('✅ Dummy database imported successfully.');
        } catch (\Exception $e) {
            $this->error('❌ Error importing database: ' . $e->getMessage());
            return;
        }

        $this->downloadDummyImages();
        $this->info('🔗 Creating symbolic link for storage...');
        $this->call('storage:link');
        $this->info('✅ Dummy data installation completed.');
    }

    /**
     * Download and extract dummy images from external URL
     */
    protected function downloadDummyImages()
    {
        $dummyImagesUrl = env('DUMMY_IMAGES_URL');
        if (!$dummyImagesUrl) {
            $this->warn('⚠️  No DUMMY_IMAGES_URL configured. Skipping image download.');
            return;
        }

        $this->line('');
        $this->warn('⚠️  DEMO IMAGE DOWNLOAD WARNING');
        $this->line("\033[33m------------------------------------------------------------\033[0m");
        $this->line("\033[33mYou are about to download demo images from:\033[0m");
        $this->line("\033[36m" . $dummyImagesUrl . "\033[0m");
        $this->line("\033[33m- Size may be large (takes 5–10 mins)\033[0m");
        $this->line("\033[33m- Files will be extracted to: storage/app/public\033[0m");
        $this->line("\033[33m- Please ensure you trust this URL\033[0m");
        $this->line("\033[33m------------------------------------------------------------\033[0m");

        if (!$this->confirm('❓ Proceed with downloading and extracting demo images?')) {
            $this->info('⏭️ Skipped demo image download.');
            return;
        }

        $storagePath = storage_path('app/public');
        if (!file_exists($storagePath)) {
            mkdir($storagePath, 0777, true);
        }

        $fileName = basename($dummyImagesUrl);
        $zipFilePath = $storagePath . '/' . $fileName;

        try {

            $this->info('⬇️  Downloading demo ZIP...');
            $response = Http::timeout(0)->get($dummyImagesUrl);

            if (!$response->successful()) {
                $this->error('❌ Failed to download the file. Check the URL or network connection.');
                return;
            }

            file_put_contents($zipFilePath, $response->body());

            $zip = new ZipArchive;
            if ($zip->open($zipFilePath) === TRUE) {
                $zip->extractTo($storagePath);
                $zip->close();
                $this->info('✅ Demo images extracted to: ' . $storagePath);
            } else {
                $this->error('❌ Failed to open and extract ZIP file.');
            }

            unlink($zipFilePath); // cleanup

        } catch (\Exception $e) {
            $this->error('❌ Error during image download: ' . $e->getMessage());
        }
    }
}

<?php

namespace Modules\Ticket\Repositories\Admin;

use Exception;
use Modules\Ticket\Models\Ticket;
use Illuminate\Support\Facades\DB;
use Modules\Ticket\Enums\RoleEnum;
use Illuminate\Support\Facades\File;
use App\Exceptions\ExceptionHandler;
use Modules\Ticket\Models\Department;
use Modules\Ticket\Models\Executive;
use Prettus\Repository\Eloquent\BaseRepository;

class DepartmentRepository extends BaseRepository
{
    protected $ticket;

    function model()
    {
        $this->ticket = new Ticket();
        return Department::class;
    }

    public function index($departmentTable)
    {
        if (request()['action']) {
            return redirect()->back();
        }

        return view('ticket::admin.department.index', ['tableConfig' => $departmentTable]);
    }

    public function store($request)
    {
        DB::beginTransaction();
        try {
            $imapCredentials = [
                'imap_host' => $request?->imap_host,
                'imap_port' => $request?->imap_port,
                'imap_username' => $request?->imap_username,
                'imap_password' => $request?->imap_password,
                'imap_protocol' => $request?->imap_protocol,
                'imap_encryption' => $request?->imap_encryption,
                'imap_default_account' => $request?->imap_default_account
            ];

            if ($request->imap_default_account == 'custom') {
                $accountName = $this->setImapConfiguration($request);
                $imapCredentials['account_name'] = $accountName;
            }

            $department = $this->model->create([
                'name' => $request->name,
                'description' => $request->description,
                'status' => $request->status,
                'imap_credentials' => $imapCredentials,
                'department_image_id' => $request->department_image_id
            ]);

            $users = [];
            foreach ($request->user_ids as $user) {
                $users[]['user_id'] = $user;
            }

            $locale = $request['locale'] ?? app()->getLocale();
            $department->setTranslation('name', $locale, $request['name']);
            $department->setTranslation('description', $locale, $request['description']);

            $department->assigned_executives()->attach($request->user_ids);

            DB::commit();

            if ($request->has('save')) {
                return to_route('admin.department.edit', ['department' => $department->id, 'locale' => $locale])
                    ->with('success', __('ticket::static.department.create_successfully'));
            }

            return to_route('admin.department.index')->with('success', __('ticket::static.department.create_successfully'));

        } catch (Exception $e) {

            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function show($id)
    {
        return to_route('admin.ticket.index', ['department' => $id]);
    }

    public function edit($id)
    {
        try {
            $department = $this->model->findOrFail($id);

            if ($department->media->isNotEmpty()) {
                $department->media_url = $department->media->first()->getUrl();
                $department->image = $department->media->first()->file_name;
            }

            $users = Executive::role(RoleEnum::Executive)->get();

            return view('ticket::admin.department.edit', ['department' => $department, 'users' => $users]);
        } catch (Exception $e) {
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function update($request, $id)
    {
        DB::beginTransaction();

        try {
            $department = $this->model->findOrFail($id);

            $imapCredentials = $department->imap_credentials;
            $imapCredentials['imap_host'] = $request['imap_host'];
            $imapCredentials['imap_port'] = $request['imap_port'];
            $imapCredentials['imap_username'] = $request['imap_username'];
            $imapCredentials['imap_password'] = $request['imap_password'];
            $imapCredentials['imap_protocol'] = $request['imap_protocol'];
            $imapCredentials['imap_encryption'] = $request['imap_encryption'];
            $imapCredentials['imap_default_account'] = $request['imap_default_account'];

            if ($request['imap_default_account'] == 'custom') {
                $accountName = $this->setImapConfiguration($request);
                $imapCredentials['account_name'] = $accountName;
            }

            $department->update([
                'name' => $request['name'],
                'description' => $request['description'],
                'status' => $request['status'],
                'imap_credentials' => $imapCredentials,
                'department_image_id' => $request['department_image_id']
            ]);

            $locale = $request['locale'] ?? app()->getLocale();
            if (isset($request['name'])) {
                $department->setTranslation('name', $locale, $request['name']);
            }

            if (isset($request['description'])) {
                $department->setTranslation('description', $locale, $request['description']);
            }

            $data = array_diff_key($request, array_flip(['name', 'description', 'locale']));
            $department->update($data);

            $department->assigned_executives()->sync($request['user_ids']);

            DB::commit();

            if (array_key_exists('save', $request)) {
                return to_route('admin.department.edit', ['department' => $department->id, 'locale' => $locale])
                    ->with('success', __('ticket::static.department.update_successfully'));
            }
            
            return to_route('admin.department.index')->with('success', __('ticket::static.department.update_successfully'));
            
        } catch (Exception $e) {
            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function status($id, $status)
    {
        try {

            $department = $this->model->findOrFail($id);
            $department->update(['status' => $status]);

            return json_encode(["resp" => $department]);
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function restore($id)
    {
        try {

            $department = $this->model->onlyTrashed()->findOrFail($id);
            $department->restore();

            return to_route('admin.department.index')->with('success', __('ticket::static.department.restore_successfully'));
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function forceDelete($id)
    {
        try {

            $department = $this->model->findOrFail($id);
            if (isset($department->imap_credentials['account_name']) && $department->imap_credentials['account_name']) {
                $this->removeImapCredentials($department->imap_credentials['account_name']);
            }
            $department->forceDelete();

            return to_route('admin.department.index')->with('success', __('ticket::static.department.permanent_delete_successfully'));
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function setImapConfiguration($request)
    {
        $configFilePath = module_path('Ticket', 'config/imap.php');

        if (!File::exists($configFilePath)) {
            throw new \Exception("Configuration file does not exist: $configFilePath");
        }

        $existingConfig = include $configFilePath;

        $departmentName = strtolower($request->name);
        $accountName = str_replace(' ', '_', $departmentName);

        $updatedConfig = array_merge_recursive(
            $existingConfig,
            [
                'accounts' =>
                [
                    $accountName => [
                        'host'  => $request->imap_host,
                        'port'  => $request->imap_port,
                        'protocol'  => $request->imap_protocol,
                        'encryption' => $request->imap_encryption,
                        'username' => $request->imap_username,
                        'password' => $request->imap_password,
                    ],
                ]
            ]
        );

        $configCode = '<?php return ' . var_export($updatedConfig, true) . ';' . PHP_EOL;

        if (File::put($configFilePath, $configCode) === false) {
            throw new \Exception("Failed to write configuration file: $configFilePath");
        }

        return $accountName;
    }

    public function removeImapCredentials($accountName)
    {
        $configFilePath = module_path('Ticket', 'config/imap.php');
        if (!File::exists($configFilePath)) {
            throw new \Exception("Configuration file does not exist: $configFilePath");
        }

        $existingConfig = include $configFilePath;
        unset($existingConfig['accounts'][$accountName]);

        $configCode = '<?php return ' . var_export($existingConfig, true) . ';' . PHP_EOL;

        if (File::put($configFilePath, $configCode) === false) {
            throw new \Exception("Failed to write configuration file: $configFilePath");
        }
    }
}

<?php

namespace App\Repositories\Admin;

use Exception;
use Carbon\Carbon;
use App\Models\User;
use App\Imports\UserImport;
use Illuminate\Support\Arr;
use App\Events\NewUserEvent;
use App\Exports\UsersExport;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\DB;
use App\Exceptions\ExceptionHandler;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Facades\Excel;
use Prettus\Repository\Eloquent\BaseRepository;

class UserRepository extends BaseRepository
{
    protected $role;

    public function model()
    {
        $this->role = new Role();
        return User::class;
    }

    public function index($userTable)
    {
        if (request()['action']) {
            return redirect()->back();
        }

        return view('admin.user.index', ['tableConfig' => $userTable]);
    }

    public function store($request)
    {
        DB::beginTransaction();
        try {

            $user = $this->model->create([
                'name' => $request->name,
                'email' => $request->email,
                'country_code' => $request->country_code,
                'phone' => (string) $request->phone,
                'status' => $request->status,
                'password' => Hash::make($request->password),
            ]);

            $role = $this->role->where('id',$request?->role_id)->get();
            $user->assignRole($role);
            if ($request->notify) {
                event(new NewUserEvent($user, $request->password));
            }

            DB::commit();

            if ($request->has('save')) {
                return to_route('admin.user.edit', $user->id)->with('success', __('static.users.create_successfully'));
            }

            return to_route('admin.user.index')->with('success', __('static.users.create_successfully'));

        } catch (Exception $e) {

            DB::rollback();

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function update($request, $id)
    {
        DB::beginTransaction();
        try {

            $request = Arr::except($request, ['password']);
            if (isset($request['phone'])) {
                $request['phone'] = (string) $request['phone'];
            }

            $user = $this->model->findOrFail($id);
            if ($user->system_reserve) {
                return redirect()->route('admin.user.index')->with('error', __('static.users.system_reserved_not_editable'));
            }

            $user->update($request);
            $user->address;

            if (isset($request['role_id'])) {
                $role = $this->role->find($request['role_id']);
                $user->syncRoles($role);
            }

            DB::commit();

            if (array_key_exists('save', $request)) {
                return to_route('admin.user.edit', $user->id)->with('success', __('static.users.update_successfully'));
            }

            return to_route('admin.user.index')->with('success', __('static.users.update_successfully'));

        } catch (Exception $e) {

            DB::rollback();

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function status($id, $status)
    {
        try {

            $user = $this->model->findOrFail($id);
            $user->update(['status' => $status]);
            if ($status != 1) {
                $user->tokens()->update([
                    'expires_at' => Carbon::now(),
                ]);
            }

            return json_encode(["resp" => $user]);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());

        }
    }

    public function destroy($id)
    {
        try {

            $user = $this->model->findOrFail($id);
            $user->destroy($id);
            return redirect()->back()->with('success', __('static.users.delete_successfully'));

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());

        }
    }

    public function restore($id)
    {
        try {

            $user = $this->model->onlyTrashed()->findOrFail($id);
            $user->restore();

            return redirect()->back()->with('success', __('static.users.restore_successfully'));

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());

        }
    }

    public function forceDelete($id)
    {
        try {

            $user = $this->model->onlyTrashed()->findOrFail($id);
            $user->forceDelete();

            return redirect()->back()->with('success', __('static.users.permanent_delete_successfully'));

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());

        }
    }

    public function export($request)
    {
        try {
            $format = $request->input('format', 'xlsx');

            if ($format == 'csv') {
                return Excel::download(new UsersExport, 'users.csv');
            }
            return Excel::download(new UsersExport, 'users.xlsx');
        } catch (Exception $e) {
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function import($request)
    {
        try {
            $activeTab = $request->input('active_tab');
            $tempFile = null;
            if ($activeTab === 'direct-link') {

                $googleSheetUrl = $request->input('google_sheet_url');

                if (!$googleSheetUrl) {
                    throw new Exception(__('static.import.no_url_provided'));
                }

                if (!filter_var($googleSheetUrl, FILTER_VALIDATE_URL)) {
                    throw new Exception(__('static.import.invalid_url'));
                }

                $parsedUrl = parse_url($googleSheetUrl);
                preg_match('/\/d\/([a-zA-Z0-9-_]+)/', $parsedUrl['path'], $matches);
                $sheetId = $matches[1] ?? null;
                parse_str($parsedUrl['query'] ?? '', $queryParams);
                $gid = $queryParams['gid'] ?? 0;

                if (!$sheetId) {
                    throw new Exception(__('static.import.invalid_sheet_id'));
                }

                $csvUrl = "https://docs.google.com/spreadsheets/d/{$sheetId}/export?format=csv&gid={$gid}";

                $response = Http::get($csvUrl);

                if (!$response->ok()) {
                    throw new Exception(__('static.import.failed_to_fetch_csv'));
                }

                $tempFile = tempnam(sys_get_temp_dir(), 'google_sheet_') . '.csv';
                file_put_contents($tempFile, $response->body());
            } elseif ($activeTab === 'local-file') {
                $file = $request->file('fileImport');
                if (!$file) {
                    throw new Exception(__('static.import.no_file_uploaded'));
                }

                if ($file->getClientOriginalExtension() != 'csv') {
                    throw new Exception(__('static.import.csv_file_allow'));
                }

                $tempFile = $file->getPathname();
            } else {
                throw new Exception(__('static.import.no_valid_input'));
            }

            Excel::import(new UserImport(), $tempFile);

            if ($activeTab === 'google_sheet' && file_exists($tempFile)) {
                unlink($tempFile);
            }

            return redirect()->back()->with('success', __('static.import.csv_file_import'));
        } catch (Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }

}

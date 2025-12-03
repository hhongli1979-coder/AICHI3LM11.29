<?php

namespace App\Exports;

use App\Models\User;
use App\Exceptions\ExceptionHandler;
use App\Tables\UserTable;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\FromCollection;

class UsersExport implements FromCollection, WithMapping, WithHeadings
{
    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        if (isDemoModeEnabled()) {
            throw new ExceptionHandler("This action is disabled in demo mode", 400);
        }

        $userTable = new UserTable(request()->merge([
            'export' => true,
        ]));
        return $userTable->getData();
    }

    public function columns(): array
    {
        return [
            'id',
            'name',
            'email',
            'country_code',
            'phone',
            'status',
            'profile_image_id',
            'password',
            'created_at'
        ];
    }

    public function map($user): array
    {
        return [
            $user->id,
            $user->name,
            $user->email,
            $user->country_code,
            $user->phone,
            $user->status,
            $user->profile_image?->original_url,
            null,
            $user->created_at
        ];
    }

    /**
     * Get the headings for the export file.
     *
     * @return array
     */
    public function headings(): array
    {
        return [
            'ID',
            'Name',
            'Email',
            'Country Code',
            'Phone',
            'Status',
            'Profile Image',
            'Password',
            'Created At'
        ];
    }

    public function filter($users, $request)
    {
        return $users->get();
    }
}

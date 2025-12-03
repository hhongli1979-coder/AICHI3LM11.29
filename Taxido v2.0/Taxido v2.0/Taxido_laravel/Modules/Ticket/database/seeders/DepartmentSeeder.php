<?php

namespace Modules\Ticket\Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Modules\Ticket\Models\Department;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $departments = [
            [
                'name' => 'General Inquiry',
                'description' => 'Providing a space for general questions and inquiries not covered by specific departments.',
                'status' => 1,
                'system_reserve' => 1,
                'imap_credentials' => [
                    'imap_host' => 'ENTER_IMAP_HOST',
                    'imap_port' => 'ENTER_IMAP_PORT',
                    'imap_encryption' => 'tls',
                    'imap_username' => 'ENTER_IMAP_USERNAME',
                    'imap_password' => 'ENTER_IMAP_PASSWORD',
                    'imap_default_account' => 'default',
                    'imap_protocol' => 'imap',
                ]
            ],
            [
                'name' => 'Technical Support',
                'description' => 'Get swift solutions for software and hardware challenges in our "Technical Support" department. Our experts are here to empower you, offering quick fixes and guidance on optimization. Trust us for a seamless tech journey.',
                'status' => 1,
                'system_reserve' => 1,
                'imap_credentials' => [
                    'imap_host' => 'ENTER_IMAP_HOST',
                    'imap_port' => 'ENTER_IMAP_PORT',
                    'imap_encryption' => 'tls',
                    'imap_username' => 'ENTER_IMAP_USERNAME',
                    'imap_password' => 'ENTER_IMAP_PASSWORD',
                    'imap_default_account' => 'default',
                    'imap_protocol' => 'imap',
                ]
            ],
            [
                'name' => 'Installation Assistance',
                'description' => 'For users seeking help with the installation of scripts, plugins, or other code snippets on the Pixel Desk platform.',
                'status' => 1,
                'system_reserve' => 1,
                'imap_credentials' => [
                    'imap_host' => 'ENTER_IMAP_HOST',
                    'imap_port' => 'ENTER_IMAP_PORT',
                    'imap_encryption' => 'tls',
                    'imap_username' => 'ENTER_IMAP_USERNAME',
                    'imap_password' => 'ENTER_IMAP_PASSWORD',
                    'imap_default_account' => 'default',
                    'imap_protocol' => 'imap',
                ]
            ],
            [
                'name' => 'Billing and Payments',
                'description' => 'Assistance with billing inquiries, payment issues, and account balance questions.',
                'status' => 1,
                'system_reserve' => 0,
                'imap_credentials' => [
                    'imap_host' => 'ENTER_IMAP_HOST',
                    'imap_port' => 'ENTER_IMAP_PORT',
                    'imap_encryption' => 'tls',
                    'imap_username' => 'ENTER_IMAP_USERNAME',
                    'imap_password' => 'ENTER_IMAP_PASSWORD',
                    'imap_default_account' => 'default',
                    'imap_protocol' => 'imap',
                ]
            ],
            [
                'name' => 'Account Management',
                'description' => 'Support for managing user accounts, including registration, password resets, and account settings.',
                'status' => 1,
                'system_reserve' => 0,
                'imap_credentials' => [
                    'imap_host' => 'ENTER_IMAP_HOST',
                    'imap_port' => 'ENTER_IMAP_PORT',
                    'imap_encryption' => 'tls',
                    'imap_username' => 'ENTER_IMAP_USERNAME',
                    'imap_password' => 'ENTER_IMAP_PASSWORD',
                    'imap_default_account' => 'default',
                    'imap_protocol' => 'imap',
                ]
            ],
            [
                'name' => 'Quality Assurance',
                'description' => 'Support for quality assurance testing and feedback.',
                'status' => 1,
                'system_reserve' => 0,
                'imap_credentials' => [
                    'imap_host' => 'ENTER_IMAP_HOST',
                    'imap_port' => 'ENTER_IMAP_PORT',
                    'imap_encryption' => 'tls',
                    'imap_username' => 'ENTER_IMAP_USERNAME',
                    'imap_password' => 'ENTER_IMAP_PASSWORD',
                    'imap_default_account' => 'default',
                    'imap_protocol' => 'imap',
                ]
            ],
            [
                'name' => 'Customer Success',
                'description' => 'Support focused on ensuring customer satisfaction and success with our services.',
                'status' => 1,
                'system_reserve' => 0,
                'imap_credentials' => [
                    'imap_host' => 'ENTER_IMAP_HOST',
                    'imap_port' => 'ENTER_IMAP_PORT',
                    'imap_encryption' => 'tls',
                    'imap_username' => 'ENTER_IMAP_USERNAME',
                    'imap_password' => 'ENTER_IMAP_PASSWORD',
                    'imap_default_account' => 'default',
                    'imap_protocol' => 'imap',
                ]
            ],
            [
                'name' => 'Maintenance Requests',
                'description' => 'Submit requests for scheduled or emergency maintenance.',
                'status' => 1,
                'system_reserve' => 0,
                'imap_credentials' => [
                    'imap_host' => 'ENTER_IMAP_HOST',
                    'imap_port' => 'ENTER_IMAP_PORT',
                    'imap_encryption' => 'tls',
                    'imap_username' => 'ENTER_IMAP_USERNAME',
                    'imap_password' => 'ENTER_IMAP_PASSWORD',
                    'imap_default_account' => 'default',
                    'imap_protocol' => 'imap',
                ]
            ],
        ];

        foreach ($departments as $value) {

            $department = Department::create([
                'name' => $value['name'],
                'description' => $value['description'],
                'status' => $value['status'],
                'system_reserve' => $value['system_reserve'],
                'imap_credentials' => $value['imap_credentials']
            ]);
            
            // Get the list of user IDs
            $userIds = $this->getExecutive();

            $department->assigned_executives()->attach($userIds);
        }
    }

    public function getExecutive()
    {
        return User::whereHas('roles', function ($q) {
            $q->where('name', 'executive');
        })?->pluck('id')->toArray();
    }
}

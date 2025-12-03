<?php

namespace App\Services;

class Prerequisites
{
    public function getPrerequisites()
    {
        $version = $this->getVersion();
        $configurations = $this->getConfigurations();
        $extensions = $this->getExtensions();
        $filePermissions = $this->getFilePermissions();
        if (!is_array($configurations)) {
            $configurations = [];
        }

        foreach ($configurations as $key => &$config) {
            if (!isset($config['status'])) {
                $config['status'] = $this->compareConfig($key, $config['current'], $config['recommended']);
            }
        }

        $result = [
            'configurations' => $configurations,
            'extensions' => $extensions,
            'file_permissions' => $filePermissions,
            'version' => $version,
        ];

        return $result;
    }

    private function getVersion()
    {
        $configuredVersion = config('prerequisites.version');
        if (!is_array($configuredVersion)) {
            return [];
        }

        $versions = [];
        foreach ($configuredVersion as $name => $value) {
            $versions[$name] = [
                'current' => $this->getCurrentVersion($name),
                'recommended' => $value,
            ];
        }
        return $versions;
    }

    private function getCurrentVersion($name)
    {
        switch (strtolower($name)) {
            case 'php':
                return PHP_VERSION;
            case 'laravel':
                return \Illuminate\Foundation\Application::VERSION;
            case 'host':
                return $_SERVER['SERVER_NAME'];
            default:
                return 'Unknown';
        }
    }

    private function getConfigurations()
    {
        $configuredValues = config('prerequisites.configurations');
        if (!is_array($configuredValues)) {
            return [];
        }

        $configurations = [];
        foreach ($configuredValues as $key => $recommended) {
            $current = ini_get($key);
            $configurations[$key] = [
                'current' => $current,
                'recommended' => $recommended,
            ];
        }

        return $configurations;
    }

    private function getExtensions()
    {
        $configuredExtensions = config('prerequisites.extensions');
        if (!is_array($configuredExtensions)) {
            return [];
        }

        $extensions = [];
        foreach ($configuredExtensions as $name) {
            $nameLower = strtolower($name);
            $isLoaded = extension_loaded($nameLower);
            $extensions[$nameLower] = [
                'current' => $isLoaded ? 'Enabled' : 'Disabled',
                'recommended' => 'Enabled',
                'status' => $isLoaded ? '✓' : '✗',
            ];
        }
        return $extensions;
    }

    private function getFilePermissions()
    {
        $filesAndFolders = config('prerequisites.file_permissions');

        if (!is_array($filesAndFolders)) {
            return [];
        }

        $result = [];
        foreach ($filesAndFolders as $item) {
            $fullPath = base_path($item);

            $displayName = '/' . ltrim($item, '/');

            $result[$item] = [
                'display_name' => $displayName,
                'current' => is_writable($fullPath) ? 'Writable' : 'Not Writable',
                'recommended' => 'Writable',
                'status' => is_writable($fullPath) ? '✓' : '✗',
            ];
        }
        return $result;
    }

    private function compareConfig($key, $current, $recommended)
    {
        switch ($key) {
            case 'max_file_uploads':
            case 'max_input_vars':
                return $current >= intval($recommended) ? '✓' : '✗';
            case 'memory_limit':
                return $this->convertToBytes($current) >= $this->convertToBytes($recommended) ? '✓' : '✗';
            default:
                return $current == $recommended ? '✓' : '✗';
        }
    }

    private function convertToBytes($value)
    {
        $value = trim($value);
        $unit = strtolower(substr($value, -1));
        $value = (int) $value;

        switch ($unit) {
            case 'g':
                $value *= 1024;
            case 'm':
                $value *= 1024;
            case 'k':
                $value *= 1024;
        }

        return $value;
    }
}

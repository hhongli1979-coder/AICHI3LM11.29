@php
$settings = getSettings();
$bgType = $settings['appearance']['sidebar_background_type'] ?? 'solid';
$solidColor = $settings['appearance']['sidebar_solid_color'] ?? '#199675';
$gradientColor1 = $settings['appearance']['sidebar_gradient_color_1'] ?? '#199675';
$gradientColor2 = $settings['appearance']['sidebar_gradient_color_2'] ?? '#212121';
@endphp

<style>
    :root {
        --primary-color: {{ $settings['appearance']['primary_color'] }};
        --font-family: {{ $settings['appearance']['font_family'] }};
        --sidebar-gradient-color-1: {{ $gradientColor1 }};
        --sidebar-gradient-color-2: {{ $gradientColor2 }};
        --sidebar-solid-color: {{ $solidColor }};
        --sidebar-background-color:
            @if ($bgType === 'gradient')
                linear-gradient(178.98deg, var(--sidebar-gradient-color-1) -453.29%, var(--sidebar-gradient-color-2) 91.53%);
            @else
                var(--sidebar-solid-color);
            @endif
    }

    .sidebar {
        background: var(--sidebar-background-color);
    }
</style>

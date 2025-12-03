@extends('admin.layouts.master')
@section('title', __('static.notify_templates.email'))

@section('content')
    @forelse ($emailTemplates as $index => $emailTemplate)
        <div class="contentbox">
            <div class="inside">
                <div class="contentbox-title">
                    <div class="contentbox-subtitle">
                        <h3>{{ $emailTemplate['name'] }}</h3>
                    </div>
                </div>
                <div class="table-main template-table notify-template-table m-0">
                    <div class="table-responsive custom-scrollbar m-0">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>{{ __('static.notify_templates.name') }}</th>
                                    <th>{{ __('static.notify_templates.description') }}</th>
                                    <th>{{ __('static.notify_templates.action') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse ($emailTemplate['templates'] as $template)
                                    <tr>
                                        <td>{{ $template['name'] }}</td>
                                        <td>{{ $template['description'] }}</td>
                                        <td>
                                            <a href="{{ route('admin.email-template.edit', ['slug' => $template['slug']]) }}"
                                                class="btn btn-link" title="Edit">
                                                <svg>
                                                    <use xlink:href="{{ asset('images/svg/edit.svg#edit') }}"></use>
                                                </svg>
                                            </a>
                                        </td>
                                    </tr>
                                @empty
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    @empty

    @endforelse
@endsection

@use('App\Models\Blog')
@use('App\Enums\RoleEnum')
@php
    $dateRange = getStartAndEndDate(request('sort'), request('start'), request('end'));
    $start_date = $dateRange['start'] ?? null;
    $end_date = $dateRange['end'] ?? null;
    $blogs = Blog::where('status', true)->orderby('created_at')->limit(2)
        ?->whereBetween('created_at', [$start_date, $end_date])
        ->get();
@endphp
@can('blog.index')
    <div class="col-xl-6">
            <div class="card">
                <div class="card-header card-no-border">
                    <div class="header-top">
                        <div>
                            <h5 class="m-0">{{__('static.blogs.recent_blog')}}</h5>
                        </div>
                        <a href="{{ route('admin.blog.index') }}"><span>{{__('static.view_all')}}</span></a>
                    </div>
                </div>
                <div class="card-body top-blogs pt-0">
                    <div class="row">
                        @forelse ($blogs as $blog)
                            <div class="col-sm-6">
                                    @php
                                        $route = route('admin.blog.edit', [$blog->id]) .
                                        '?locale=' .
                                        app()->getLocale();
                                    @endphp
                                    <a href="{{ $route }}"><img src="{{ asset($blog?->blog_thumbnail?->asset_url ?? '') }}" class="img-fluid"
                                    alt=""></a>
                                <h5>{{ $blog->title }}</h5>
                                <p>{{ $blog->description }}</p>
                                <div class="d-flex">
                                    <a href="{{ route('blog.slug',@$blog['slug']) }}">{{__('static.blogs.read_more')}}</a>
                                    <span>| {{ $blog->created_at->format('d M, Y') }}</span>
                                </div>
                            </div>
                        @empty

                            <div class="table-no-data">
                                <img src = "{{ asset('images/dashboard/data-not-found.svg') }}" alt="data not found">
                                <h6 class="text-center">{{ __('static.widgets.no_data_available') }}</h6>
                            </div>
                        @endforelse
                    </div>
                </div>
            </div>
    </div>
@endcan

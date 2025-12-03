<!-- footer start-->
<footer class="footer">
    <div class="container-fluid">
        <div class="row align-items-center g-sm-0 g-2">
            <div class="col-md-5">
                @if (!empty(getSettings()['general']['copyright']))
                    <p class="mb-0 text-md-start text-center">
                        Copyright {{ date('Y') }} &copy; {{ getSettings()['general']['copyright'] }}
                    </p>
                @endif
            </div>
            <div class="col-md-7">
                <div class="footer-system">
                    @if (env('APP_VERSION'))
                        <span class="ms-md-auto mx-sm-0 text-end badge badge-version-primary">{{ env('APP_VERSION') }}</span>
                    @endif
                    <span class="d-flex ms-md-3 mx-sm-0 text-end badge badge-version-primary">{{ __('static.load_time') }}:
                        {{ round(microtime(true) - LARAVEL_START, 2) }}s.</span>
                </div>
            </div>
        </div>
    </div>
</footer>
<!-- footer end-->

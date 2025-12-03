@component('mail::message')
            <h3 class="card-title">{{ @$content['title'][$locale] }}</h3>
            <p class="card-text">{!! @$emailContent !!}</p>
@endcomponent

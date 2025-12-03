@component('mail::message')
    <strong>Test Mail details: </strong><br>
    <strong>Mail From Name: </strong>{{ $request?->mail_from_name }} <br>
    <strong>Mail From Email: </strong>{{ $request?->mail_from_address }} <br>
    <strong>Mail Mailer: </strong>{{ $request?->mail_mailer }} <br>
    <strong>Mail Host: </strong>{{ $request?->mail_from_address }} <br>
    <strong>Mail Port: </strong>{{ $request?->mail_port }} <br>
    <strong>Mail Encryption: </strong>{{ $request?->mail_from_address }} <br>
    <strong>Mail Username: </strong>{{ $request?->mail_username }} <br><br>
@endcomponent


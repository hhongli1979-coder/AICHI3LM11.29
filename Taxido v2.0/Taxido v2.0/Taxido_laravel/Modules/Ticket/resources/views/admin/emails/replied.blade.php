@component('mail::message')
    <strong>Ticket details: </strong><br>
    <strong>Name: </strong>Admin <br>
    <strong>Ticket Number: </strong>{{ $contact->ticket->ticket_number }} <br>
    <strong>Message: </strong>{!! $contact->message !!} <br><br>
@endcomponent
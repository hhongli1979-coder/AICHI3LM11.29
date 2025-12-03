@component('mail::message')
    <strong>Ticket details: </strong><br>
    <strong>Name: </strong>Admin <br>
    <strong>Ticket Number: </strong>{{ $ticket->ticket_number }} <br>
    <strong>Message: </strong><br>
    Hello, <br>
    We wanted to provide you with an update regarding your recent ticket, ID. #{{$ticket->ticket_number}}. <br>
    Your ticket status has been updated to {{$ticket->ticketStatus->name}}.<br>
    Please feel free to reach out to us if you have any questions or need assistance.
@endcomponent
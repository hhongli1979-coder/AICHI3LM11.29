@component('mail::message')
    <strong>Contect Us details: </strong><br>
    <strong>Name: </strong>Admin <br>
    <strong>Message: </strong>Thank You for connecting with us. Your Ticket has been created <br>
    <strong>Ticket Number is: </strong>#{{ $ticket->ticket_number }} <br>
@endcomponent
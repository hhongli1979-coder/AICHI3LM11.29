<?php

namespace App\Enums;


enum ScheduleStatus: string
{
    case DELIVERED = 'delivered';
    case SCHEDULED = 'scheduled';

    // case DELIVERED;
    // case SCHEDULED;

}

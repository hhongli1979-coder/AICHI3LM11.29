<?php

namespace Modules\Taxido\Enums;

enum SOSStatusEnum: string
{
    const REQUESTED = 'requested';
    const PROCESSING = 'processing';
    const COMPLETED = 'completed';
}

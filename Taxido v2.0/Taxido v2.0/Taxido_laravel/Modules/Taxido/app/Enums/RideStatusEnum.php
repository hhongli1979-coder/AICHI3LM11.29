<?php

namespace Modules\Taxido\Enums;

enum RideStatusEnum:string {

  const PENDING = 'pending';
  const REQUESTED = 'requested';
  const SCHEDULED = 'scheduled';
  const ACCEPTED = 'accepted';
  const REJECTED = 'rejected';
  const ARRIVED = 'arrived';
  const STARTED = 'started';
  const CANCELLED = 'cancelled';
  const COMPLETED = 'completed';
}

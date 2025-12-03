<?php

namespace Modules\Taxido\Enums;

enum BidStatusEnum:string {
  const REQUESTED = 'requested';
  const ACCEPTED = 'accepted';
  const REJECTED = 'rejected';
}

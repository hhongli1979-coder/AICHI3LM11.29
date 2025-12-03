<?php

namespace Modules\Taxido\Enums;

  enum VehicleUseForEnum:string {
    case RIDE = 'ride';
    case PARCEL = 'parcel';
    case FREIGHT = 'freight';
    case INTERCITY = 'intercity';
    case RENTAL = 'rental';
  }

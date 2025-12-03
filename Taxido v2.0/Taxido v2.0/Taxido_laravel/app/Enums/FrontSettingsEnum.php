<?php

namespace App\Enums;

enum FrontSettingsEnum:string {
  case GENERAL = 'general';
  case ACTIVATION = 'activation';
  case ADMIN_COMMISSION = 'admin_commissions';
  case GOOGLE_RECAPTCHA = 'google_reCaptcha';
  case FIREBASE = "firebase";
}

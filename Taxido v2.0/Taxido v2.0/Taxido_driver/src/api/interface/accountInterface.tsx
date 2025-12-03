export interface AccountInterface {
  id: number
  name: string
  username: string
  email: string
  email_verified_at: string
  country_code: string
  phone: number
  profile_image_id: string
  status: number
  referral_code: string
  referred_by_id: string
  created_by_id: string
  system_reserve: string
  deleted_at: string
  created_at: string
  updated_at: string
  role: string
  permission: []
  roles: []
  permissions: []
}


export interface BankDetailsinterface {
  bank_name: string,
  bank_holder_name: string,
  bank_account_no: string,
  routing_number: string,
  swift: string,
  paypal_email: string
  default?: string
}

export interface updateVehicleInterface {
  // service: string,
  // service_category: string,
  // vehicle_name: string,
  // vehicle_no: string,
  // vehicle_type_id: number,
  // color: string,
  // seat: number,
  // plate_number: string,
  // model: string
}

export interface countryInterface {

}

export interface UpdateProfileInterface {
  email?: string;
  phone?: string;
  country_code?: string;
  token?: string;
  email_or_phone?: string;
  data?: any;
}



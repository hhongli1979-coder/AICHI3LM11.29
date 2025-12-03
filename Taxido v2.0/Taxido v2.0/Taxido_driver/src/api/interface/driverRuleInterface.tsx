export interface DriverRuleInterface {
  success?: boolean
  driverRuleData?: DriverRuleDataInterface
  loading?: boolean
}

export interface DriverRuleDataInterface {
  id: number
  title: string
  slug: string
  rule_image_id: number
  status: number
  created_by_id: number
  created_at: string
  updated_at: string
  deleted_at: string
  rule_image: string
}

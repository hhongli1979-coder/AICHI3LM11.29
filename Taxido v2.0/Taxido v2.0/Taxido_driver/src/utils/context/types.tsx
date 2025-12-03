export interface ContextType {
  isDark: boolean
  setIsDark: React.Dispatch<React.SetStateAction<boolean>>
  rtl: boolean
  setRtl: React.Dispatch<React.SetStateAction<boolean>>
  t?: any // Make t optional since it's missing in implementation
  textRtlStyle: any
  imageRtlStyle: any
  viewRtlStyle: any
  viewSelfRtlStyle: any
  token: any
  setToken: any
  accountDetail: any
  setAccountDetail: any
  documentDetail: any
  setDocumentDetail: any
  vehicleDetail: any
  setVehicleDetail: any
  Google_Map_Key: string
  notificationValue: any,
  setNotificationValues: React.Dispatch<React.SetStateAction<boolean>>,
}
export interface DropdownProps {
  open: boolean
  value: string | null
  items: { label: string; value: string }[]
  onChange: any
  setOpen: any
  containerStyle?: Record<string, any>
  zIndex?: number
  placeholderValue?: string
  setValue?: any
}

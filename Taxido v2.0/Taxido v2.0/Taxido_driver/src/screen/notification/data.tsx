import { ReactNode } from 'react'

export const notificationData: Array<{
  id: number
  title: string
  subtitle: string
  time: string
  icon: ReactNode
}> = [
  {
    id: 0,
    title: 'Account Alert!',
    subtitle: 'You have booked plumber service today at 6:30pm.',
    time: '2 min ago',
    icon: '',
  },
  {
    id: 1,
    title: 'Receive 20% discount for first ride',
    subtitle: 'You have booked plumber service today at 6:30pm.',
    time: '2 min ago',
    icon: '',
  },
  {
    id: 2,
    title: 'New year shopping with rider!',
    subtitle: 'You have booked plumber service today at 6:30pm.',
    time: '2 min ago',
    icon: '',
  },
  {
    id: 3,
    title: 'New year shopping with rider!',
    subtitle: 'You have booked plumber service today at 6:30pm.',
    time: '2 min ago',
    icon: '',
  },
]

import { Notifier, NotifierComponents } from 'react-native-notifier'

export function notificationHelper(title: string, message: string, type: any) {
  Notifier.showNotification({
    title,
    description: message,
    duration: 3000,
    showAnimationDuration: 800,
    hideAnimationDuration: 800,
    Component: NotifierComponents.Alert,
    componentProps: {
      alertType: type,
    },
  })
}

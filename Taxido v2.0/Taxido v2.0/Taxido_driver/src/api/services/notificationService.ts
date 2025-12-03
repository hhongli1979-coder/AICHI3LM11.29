import { notifications } from '../endpoints/notificationEndPoint'
import { GET_API } from '../methods'
import { NotificationInterface } from '../interface/notificationInterface'

export const notificationData = async () => {
  return GET_API(notifications)
    .then(res => {
      return res
    })
    .catch(e => {
      return e?.response
    })
}

const notificationService = {
  notificationData,
}

export default notificationService

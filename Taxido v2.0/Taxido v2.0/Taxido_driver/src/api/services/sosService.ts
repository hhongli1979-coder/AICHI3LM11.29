import { sos, sosAlert } from '../endpoints/sosEndpoint'
import { sosAlertDataInterface } from '../interface/sosInterface'
import { GET_API, POST_API } from '../methods'

export const sosDataGet = async () => {
  return GET_API(sos)
    .then(res => {
      return res
    })
    .catch(e => {
      return e?.response
    })
}

export const sosAlertGet = async (data: sosAlertDataInterface) => {
  return POST_API(data, sosAlert)
    .then(res => {
      return res
    })
    .catch(e => {
      return e?.response
    })
}

const sosServices = {
  sosDataGet,
  sosAlertGet,
}

export default sosServices

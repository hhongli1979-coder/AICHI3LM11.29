import { driverRule } from '../endpoints/driverRuleEndPoint'
import { GET_API } from '../methods'

export const driverRuleType = async () => {
  return GET_API(driverRule)
    .then(res => {
      return res
    })
    .catch(e => {
      return e?.response
    })
}

const driverRuleServices = {
  driverRuleType,
}

export default driverRuleServices

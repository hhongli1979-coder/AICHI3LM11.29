import { cancellationReason } from '../endpoints/cancelationEndPoint'
import { GET_API } from '../methods'

export const cancelationData = async ({
  ride_start,
}: {
  ride_start: string
}) => {

  return GET_API(`${cancellationReason}&ride_start=${ride_start}`)
    .then(res => {
      return res
    })
    .catch(e => {
      return e?.response
    })
}

const cancelationServices = {
  cancelationData,
}

export default cancelationServices

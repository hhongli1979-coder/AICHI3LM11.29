import { dashBoard } from '../endpoints/dashboardEndPoint'
import { GET_API } from '../methods'

export const dashBoardData = async ({
  unit,
  zoneId,
  driver_id
}: {
  unit: string
  zoneId: number
  driver_id: number
}) => {
  return GET_API(`${dashBoard}?unit=${unit}&zoneId=${zoneId}&driver_id=${driver_id}`)
    .then(res => {
      return res
    })
    .catch(e => {
      return e?.response
    })
}
const dashBoardService = {
  dashBoardData,
}

export default dashBoardService

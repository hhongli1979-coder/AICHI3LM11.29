import { bid } from '../endpoints/bidEndPoint'
import { POST_API, GET_API } from '../methods'
import { BidInterface } from '../interface/bidInterface'

export const bidDataPost = async (data: BidInterface) => {
  return POST_API(data, bid)
    .then(res => {
      return res
    })
    .catch(e => {
      return e?.response
    })
}

export const bidDataGet = async (bid_id: number) => {
  return GET_API(`${bid}/${bid_id}`)
    .then(res => {
      return res
    })
    .catch(e => {
      return e?.response
    })
}

const bidServices = {
  bidDataPost,
  bidDataGet,
}

export default bidServices

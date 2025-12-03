import { riderReview } from '../endpoints/reviewEndpoint'
import { POST_API } from '../methods'
import { ReviewInterface } from '../interface/reviewInterface'

export const review = async (data: ReviewInterface) => {
  return POST_API(data, riderReview)
    .then(res => {
      return res
    })
    .catch(e => {
      return e?.response
    })
}

const reviewService = {
  review,
}

export default reviewService

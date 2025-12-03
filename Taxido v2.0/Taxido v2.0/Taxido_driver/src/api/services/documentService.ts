import { document } from '../endpoints/documentEndPoint'
import { GET_API } from '../methods'

export const documentType = async ({ type }: { type: string }) => {
  return GET_API(`${document}?type=${type}`)
    .then(res => {
      return res
    })
    .catch(e => {
      return e?.response
    })
}

const documentServices = {
  documentType,
}

export default documentServices

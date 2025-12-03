import { useSelector } from 'react-redux'

export const useRideStatusData = () => {
  const { translateData } = useSelector(state => state.setting)

  return [
    {
      id: 0,
      title: translateData?.active,
    },
    {
      id: 1,
      title: translateData?.pendingRide,
    },
    {
      id: 2,
      title: translateData?.schedule,
    },
    {
      id: 3,
      title: translateData?.complete,
    },
    {
      id: 4,
      title: translateData?.cancel,
    },
  ]
}

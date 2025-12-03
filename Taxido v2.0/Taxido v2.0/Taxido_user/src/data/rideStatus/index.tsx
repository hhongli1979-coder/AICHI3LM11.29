import { useSelector } from "react-redux";

export const ridesStatusData = () => {

  const { translateData } = useSelector((state: any) => state.setting);

  return [
    {
      id: 0,
      title: translateData.upcoming || 'Upcoming',
    },
    {
      id: 1,
      title: translateData.activeride || 'Active',
    },
    {
      id: 2,
      title: translateData.past || 'Past',
    },
  ];
}

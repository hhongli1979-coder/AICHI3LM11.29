import { ImageSourcePropType } from 'react-native';
import Images from '@utils/images'; 

export const CancelFareData: Array<{
  id: number;
  title: string;
  subtitle: string;
  min: string;
  km: string;
  price: string;
  img: ImageSourcePropType;
  rating: string;
  totalRating: string;
  date: string
}> = [
    {
      id: 0,
      title: 'myRide.teslaCar',
      subtitle: 'driverDetails.jonathanHiggins',
      min: 'driverDetails.time',
      km: 'driverDetails.distance',
      price: '100',
      img: Images.profileUser,
      rating: '4.8',
      totalRating: '(127)',
      date: '28 Nov 2023, 09:00AM'
    },
    {
      id: 1,
      title: 'myRide.teslaCar',
      subtitle: 'driverDetails.tonyDanza',
      min: 'driverDetails.time',
      km: 'driverDetails.distance',
      price: '110',
      img: Images.profileUser,
      rating: '4.5',
      totalRating: '(127)',
      date: '28 Nov 2023, 09:00AM'
    },
    {
      id: 2,
      title: 'myRide.teslaCar',
      subtitle: 'driverDetails.kateTanner',
      min: 'driverDetails.time',
      km: 'driverDetails.distance',
      price: '110',
      img: Images.profileUser,
      rating: '4.3',
      totalRating: '(127)',
      date: '28 Nov 2023, 09:00AM'
    },
  ];

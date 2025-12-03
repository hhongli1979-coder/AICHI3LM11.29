import React, { useEffect, useRef } from 'react';
import { Text, View } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { useTheme } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import appColors from '../../../../theme/appColors';
import { serviceDataGet } from '../../../../api/store/action';
import { useValues } from '../../../../utils/context';
import styles from './styles';
import { AppDispatch } from '../../../../api/store';


interface RenderItemsProps {
  selectedItemIndex: number | null
  handleItemPress: (
    index: number,
    name: string,
    id: number,
    slug: string,
  ) => void
  serviceId: number,
  setSelectedItemIndex: any
}

export function RenderServiceList({
  selectedItemIndex,
  handleItemPress,
  serviceId,
  setSelectedItemIndex
}: RenderItemsProps) {
  const { serviceData } = useSelector((state: any) => state.service);
  const dispatch = useDispatch<AppDispatch>();
  const { viewRtlStyle, isDark } = useValues();
  const { colors } = useTheme();
  const initialSelectedSet = useRef(false);

  useEffect(() => {
    dispatch(serviceDataGet());
  }, []);

  useEffect(() => {
    if (!initialSelectedSet.current && serviceData?.data?.length > 0) {
      const index = serviceData.data.findIndex((item: any) => item.id === serviceId);
      if (index !== -1) {
        setSelectedItemIndex(index);
        initialSelectedSet.current = true;
      }
    }
  }, [serviceData, serviceId]);

  const onItemPress = (index: number, slug: string, id: number, name: string) => {
    setSelectedItemIndex(index);
    handleItemPress(index, slug, id, name);
  };

  return (
    <>
      {serviceData?.data
        ?.filter((item: any, index: number) => {
          if (selectedItemIndex === 3) {
            return index === 3;
          }
          if (selectedItemIndex === null) {
            return true;
          }
          return index !== 3;
        })
        .map((item: any, index: number) => (
          <View
            key={index}
            style={[
              styles.listView,
              {
                borderColor: selectedItemIndex == 3 ? appColors.subPrimary : isDark
                  ? colors.border
                  : selectedItemIndex === index
                    ? appColors.subPrimary
                    : appColors.white,
                backgroundColor: selectedItemIndex == 3 ? appColors.subPrimary : isDark
                  ? selectedItemIndex === index
                    ? appColors.primary
                    : colors.card
                  : selectedItemIndex === index
                    ? appColors.subPrimary
                    : appColors.white,
              },
            ]}
          >
            <View
              style={[
                styles.iconAndTextContainer,
                { flexDirection: viewRtlStyle },
              ]}
            >
              <SvgUri
                width={34}
                height={34}
                uri={item?.service_icon_url}
                stroke={'none'}
                fill={isDark ? appColors.white : 'transparent'}
              />
            </View>
            <Text
              style={[
                styles.serviceTitle,
                {
                  color:
                    selectedItemIndex === index ? appColors.black : colors.text,
                },
              ]}
            >
              {item?.name}
            </Text>
          </View>
        ))}
    </>
  );
}

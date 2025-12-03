import { FlatList, Image, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { external } from '../../../styles/externalStyle';
import { styles } from './styles';
import { MessageItem } from '../messageItem/index';
import { useDispatch, useSelector } from 'react-redux';
import { notificationDataGet } from '../../../api/store/actions/notificationAction';
import Images from '@src/utils/images';
import { useValues } from '@src/utils/context/index';
import { appColors, windowHeight } from '@src/themes';
import { again_Amazing } from '@src/constant';
import { Button } from '@src/commonComponent';
import { AppDispatch, RootState } from '@src/api/store';

export function TopCategory() {
  const dispatch = useDispatch<AppDispatch>();
  const { notificationList }: any = useSelector((state: RootState) => state.notification);
  const { translateData }: any = useSelector((state: RootState) => state.setting);
  const { textColorStyle, isDark } = useValues();

  useEffect(() => {
    dispatch(notificationDataGet());
  }, []);

  const ItemSeparatorComponent = () => {
    return <View style={styles.viewWidth} />;
  };

  const renderItem = ({ item }: any) => <MessageItem item={item} />;

  return (
    <View style={[external.mt_20]}>
      {notificationList?.data?.length > 0 ? (
        <FlatList
          ItemSeparatorComponent={ItemSeparatorComponent}
          data={notificationList?.data}
          renderItem={renderItem}
          contentContainerStyle={[external.mh_15, { paddingBottom: windowHeight(50) }]}
          removeClippedSubviews={true}
        />
      ) : (
        <View
          style={[
            styles.centerContainer,
            {
              backgroundColor: isDark
                ? appColors.bgDark
                : appColors.notificationColor,
            },
          ]}>
          <Image style={styles.image} source={Images.bellNotification} />
          <Text style={[styles.title, { color: textColorStyle }]}>
            {translateData.nothinghhere}
          </Text>
          <Text style={[styles.text]}>
            {translateData.clickToRefresh}
            {'\n'} {again_Amazing}
          </Text>
          <View style={styles.refreshButtonContainer}>
            <Button
              title={translateData.refresh}
              onPress={() => dispatch(notificationDataGet())}
            />
          </View>
        </View>
      )}
    </View>
  );
}

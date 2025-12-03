import React, { useEffect, useState } from 'react'
import { View, Text, Dimensions, ScrollView, TouchableOpacity, BackHandler } from 'react-native'
import Carousel from 'react-native-reanimated-carousel'
import Animated from 'react-native-reanimated'
import { Header } from '../../../commonComponents'
import appColors from '../../../theme/appColors'
import Icons from '../../../utils/icons/icons'
import { useNavigation, useTheme } from '@react-navigation/native'
import styles from './styles'
import { useValues } from '../../../utils/context'
import { useSelector } from 'react-redux'
import { windowHeight } from '../../../theme/appConstant'

export function Subscription() {

  const width = Dimensions.get('window').width
  const [isNotificationOn, setIsNotificationOn] = useState<boolean>(false)
  const { colors } = useTheme()
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const { viewRtlStyle, isDark } = useValues()
  const { planData } = useSelector((state: any) => state.setting)
  const { navigate } = useNavigation<any>()
  const { translateData } = useSelector((state: any) => state.setting)
  const { zoneValue } = useSelector((state: any) => state.zoneUpdate)


  const gotopayment = (planId: number) => {
    navigate('PaymentSelect', { planId })
  }

  const renderItem = ({ item, index }: any) => {
    const isEven = index % 2 === 0;

    return (
      <Animated.View
        style={[
          styles.item,
          {
            backgroundColor: isEven
              ? isDark ? appColors.darkThemeSub : appColors.graybackground
              : appColors.primary,
          },
        ]}
      >
        <View
          style={[
            styles.centerAlign,
            {
              backgroundColor: isEven
                ? appColors.primary
                : isDark ? appColors.darkThemeSub : appColors.white,
            },
          ]}
        >
          <Text
            style={[
              styles.itemText,
              {
                color: isEven ? appColors.white : appColors.primary,
              },
            ]}
          >
            {item.name.toUpperCase()}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              paddingBottom: 10,
            }}
          >
            <Text
              style={[
                styles.price,
                { color: isEven ? appColors.white : isDark ? appColors.white : appColors.primaryFont },
              ]}
            >
              {zoneValue?.currency_symbol}
              {zoneValue?.exchange_rate * Math.floor(item.price)}
            </Text>
            <Text
              style={[
                styles.type,
                { color: isEven ? appColors.planLine : appColors.secondaryFont },
              ]}
            >
              /{translateData.month}
            </Text>
          </View>
        </View>

        <View
          style={{
            backgroundColor: isEven ? appColors.darkLine : appColors.line,
            height: windowHeight(1),
          }}
        />

        <View style={{ paddingHorizontal: windowHeight(3) }}>
          <ScrollView >
            {item.description.map((feature: any, idx: number) => (
              <View
                key={idx}
                style={[styles.featureRow, { flexDirection: viewRtlStyle }]}
              >
                <Icons.ShildTik
                  background={isEven ? appColors.primary : appColors.white}
                  tik={isEven ? appColors.primary : appColors.white}
                />
                <Text
                  style={[
                    styles.features,
                    { color: isEven ? colors.text : appColors.white },
                  ]}
                >
                  {feature}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.msgContainer}>
          <View style={[styles.direction, { flexDirection: viewRtlStyle }]}>
            <View
              style={[
                styles.dot,
                { backgroundColor: isEven ? appColors.planLine : appColors.planDot },
              ]}
            />
            <View
              style={[
                styles.dashLine,
                { borderColor: isEven ? appColors.planLine : appColors.planDot },
              ]}
            />
            <View
              style={[
                styles.dot,
                { backgroundColor: isEven ? appColors.planLine : appColors.planDot },
              ]}
            />
          </View>
          <Text
            style={[
              styles.msg,
              { color: isEven ? colors.text : isDark ? appColors.black : appColors.white },
            ]}
          >
            {translateData.subNote}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => gotopayment(item.id)}
          style={[
            styles.selectBtn,
            {
              backgroundColor: isEven ? appColors.primary : isDark ? appColors.darkThemeSub : appColors.white,
            },
          ]}
        >
          <Text
            style={[
              styles.bottomNote,
              { color: isEven ? appColors.white : appColors.primary },
            ]}
          >
            {translateData.selectPlan}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const navigation = useNavigation();

  useEffect(() => {
    const backAction = () => {
      if (navigation.canGoBack()) {
        navigation.goBack();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

  return (
    <View
      style={[
        styles.MainContainer,
        { backgroundColor: isDark ? appColors.primaryFont : appColors.white },
      ]}
    >
      <View
        style={{
          backgroundColor: isDark ? appColors.primaryFont : appColors.white,
        }}
      >
        <Header
          title={translateData.planDetails}
          backgroundColor={isDark ? appColors.primaryFont : appColors.white}
        />
      </View>
      <View
        style={[
          styles.planTitleContainer,
          { backgroundColor: isDark ? appColors.primaryFont : appColors.white },
        ]}
      >
        <Text
          style={[
            styles.planTitle,
            { color: isNotificationOn ? appColors.primary : colors.text },
          ]}
        >
          {translateData.subscriptionTitle}
        </Text>
        <Text style={styles.planHeading}>{translateData.subscriptionMsg}</Text>
      </View>
      <View style={styles.container}>
        <Carousel
          width={width}
          height={windowHeight(70)}
          data={planData?.data || []}
          renderItem={renderItem}
          sliderWidth={width}
          itemWidth={width * 0.8}
          inactiveSlideOpacity={0.7}
          inactiveSlideScale={0.8}
          mode="parallax"
          loop={false}
          onSnapToItem={index => setCurrentIndex(index)}
          useNativeDriver={true}
        />
      </View>
      <View
        style={[
          styles.noteContainer,
          {
            backgroundColor: isDark
              ? appColors.darkThemeSub
              : appColors.planNote,
          },
        ]}
      >
        <Text style={[styles.note, { color: colors.text }]}>
          {' '}
          {translateData.subscriptionNote}
        </Text>
      </View>
    </View>
  )
}

import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { View, Text, TouchableOpacity, TextInput, Keyboard } from 'react-native'
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet'
import appColors from '../../../theme/appColors'
import Icons from '../../../utils/icons/icons'
import styles from './styles'
import { Button } from '../../../commonComponents'
import { useTheme } from '@react-navigation/native'
import { useValues } from '../../../utils/context'
import { userReview } from '../../../api/store/action'
import { useDispatch, useSelector } from 'react-redux'
import { ReviewInterface } from '../../../api/interface/reviewInterface'
import { windowHeight } from '../../../theme/appConstant'
import { AppDispatch } from '../../../api/store'

export function RateCustomer({ bottomSheetRef }: any) {
  const [rating, setRating] = useState<number>(0)
  const [reviewText, setReviewText] = useState<string>('')
  const { colors } = useTheme()
  const { viewRtlStyle, textRtlStyle, isDark } = useValues()
  const dispatch = useDispatch<AppDispatch>()
  const { rideGet } = useSelector((state: any) => state.ride)
  const { translateData } = useSelector((state: any) => state.setting)
  const [isKeyboardVisible, setKeyboardVisible] = useState<boolean>(false)

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true)
      bottomSheetRef?.current?.expand()
    })
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false)
      bottomSheetRef?.current?.close()
    })


    return () => {
      keyboardDidShowListener.remove()
      keyboardDidHideListener.remove()
    }
  }, [])
  const snapPoints = useMemo(() => ['37%', '70%'], [])

  const handleClose = () => {
    bottomSheetRef.current?.close();
  }

  const handleStarPress = (selectedRating: number) => {
    setRating(selectedRating)
  }

  const reviewSubmit = () => {
    let payload: ReviewInterface = {
      ride_id: rideGet?.id,
      rating: rating,
      description: reviewText,
    }

    dispatch(userReview(payload))
      .unwrap()
      .then((res: any) => {
        bottomSheetRef.current?.close();
      })
  }

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        pressBehavior="close"
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        onPress={handleClose}
      />
    ),
    []
  )

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{ backgroundColor: appColors.primary, width: '13%' }}
      onClose={handleClose}
      backgroundStyle={{ backgroundColor: isDark ? appColors.bgDark : appColors.white }}
    >
      <BottomSheetView style={{ padding: windowHeight(2) }}>

        <Text style={[styles.title, { color: isDark ? appColors.white : appColors.primaryFont }]}>
          {translateData.rateaCustomer}
        </Text>

        <View
          style={[
            styles.container,
            { flexDirection: viewRtlStyle, borderColor: colors.border },
          ]}
        >
          {[1, 2, 3, 4, 5].map(index => (
            <TouchableOpacity
              key={index}
              onPress={() => handleStarPress(index)}
              style={styles.starIcon}
            >
              {index <= rating ? <Icons.StarFill /> : <Icons.StarEmpty />}
            </TouchableOpacity>
          ))}

          <View style={[styles.ratingView, { flexDirection: viewRtlStyle }]}>
            <View style={[styles.borderVertical, { borderColor: colors.border }]} />
            <Text style={[styles.rating, { color: isDark ? appColors.white : appColors.primaryFont }]}>
              {rating}/5
            </Text>
          </View>
        </View>

        <View style={[styles.border, { borderColor: colors.border }]} />

        <Text style={[styles.message, { color: colors.text, textAlign: textRtlStyle }]}>
          {translateData.customMessage}
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.background,
              borderColor: colors.border,
              color: isDark ? appColors.white : appColors.primaryFont,
              textAlign: textRtlStyle,
            },
          ]}
          placeholder={translateData.writeHere}
          placeholderTextColor={appColors.secondaryFont}
          multiline
          numberOfLines={2}
          value={reviewText}
          onChangeText={setReviewText}
        />
        <View style={{ width: '110%', alignSelf: 'center' }}>
          <Button
            title={translateData.submit}
            color={appColors.white}
            backgroundColor={appColors.primary}
            onPress={reviewSubmit}
          />
        </View>
      </BottomSheetView>
    </BottomSheet>
  )
}

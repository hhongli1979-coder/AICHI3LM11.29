import React, { useState, useImperativeHandle, forwardRef, useEffect } from "react";
import { View, Text, TextInput } from "react-native";
import { useTheme } from "@react-navigation/native";
import { useValues } from "../../../../../utils/context";
import { useSelector, useDispatch } from "react-redux";
import appColors from "../../../../../theme/appColors";
import styles from "./styles";
import { paymentsData } from "../../../../../api/store/action";
import { fontSizes, windowHeight, windowWidth } from "../../../../../theme/appConstant";
import appFonts from "../../../../../theme/appFonts";
import { AppDispatch } from "../../../../../api/store";

export const AddTopUp = forwardRef((ref: any) => {
  const { colors } = useTheme()
  const { viewRtlStyle, textRtlStyle, isDark, rtl } = useValues()
  const dispatch = useDispatch<AppDispatch>()
  const [withdrawAmount, setWithdrawAmount] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const { translateData } = useSelector((state: any) => state.setting)
  const { zoneValue } = useSelector((state: any) => state.zoneUpdate)

  useEffect(() => {
    dispatch(paymentsData())
  }, [])

  useImperativeHandle(ref, () => ({
    getValues: () => ({ withdrawAmount, description })
  }))


  const { selfDriver } = useSelector((state: any) => state.account);




  return (
    <View>
      <Text style={[styles.addBalance, { color: colors.text, textAlign: textRtlStyle }]}>
        {translateData.addTopupBalance}
      </Text>
      <Text style={[styles.amount, { textAlign: textRtlStyle }]}>
        {translateData.enterAmount}
      </Text>
      <View style={styles.inputContainer}>
        <View
          style={[
            styles.inputView,
            {
              backgroundColor: colors.card,
              flexDirection: viewRtlStyle,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={{ color: isDark ? appColors.white : appColors.black, marginBottom: windowHeight(0.5) }}>
            {zoneValue?.currency_symbol}
          </Text>
          <TextInput
            style={[styles.textinput, { backgroundColor: colors.card, color: colors.text }]}
            placeholder={translateData.amount}
            placeholderTextColor={isDark ? appColors.darkText : appColors.secondaryFont}
            keyboardType="numeric"
            value={withdrawAmount}
            onChangeText={setWithdrawAmount}
          />
        </View>

        <Text style={[styles.title, { color: colors.text, textAlign: textRtlStyle }]}>
          {translateData.customMessage}
        </Text>
        <TextInput
          style={[
            styles.textInputDetail,
            { borderColor: colors.border },
            { textAlign: textRtlStyle },
            { backgroundColor: colors.card, color: colors.text },
          ]}
          placeholder={translateData.enterDetails}
          placeholderTextColor={isDark ? appColors.darkText : appColors.secondaryFont}
          multiline={true}
          numberOfLines={4}
          textAlignVertical="top"
          value={description}
          onChangeText={setDescription}
        />
        {selfDriver?.payment_account?.default !== null && selfDriver?.payment_account?.default !== undefined &&
          <View style={[{ flexDirection: viewRtlStyle }, styles.view]}>
            <Text style={[styles.title, { color: colors.text, textAlign: textRtlStyle }]}>
              {translateData?.withdrawalMethod}
            </Text>
            <Text style={{
              color: appColors.primary, fontFamily: appFonts.medium, fontSize: fontSizes.FONT4, marginHorizontal: windowWidth(3), marginTop: windowHeight(1)
            }}>{selfDriver?.payment_account?.default}</Text>
          </View>}
      </View>
    </View>
  )
})

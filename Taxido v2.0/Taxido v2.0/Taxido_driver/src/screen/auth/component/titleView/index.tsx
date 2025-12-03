import React from 'react'
import { View, Text } from 'react-native'
import { useValues } from '../../../../utils/context'
import styles from './styles'
import appColors from '../../../../theme/appColors'
import { CustomRadioButton } from '../../../../commonComponents'
import { fontSizes, windowHeight, windowWidth } from '../../../../theme/appConstant'
import { useSelector } from 'react-redux'

interface TitleViewProps {
  title: string
  subTitle: string
  primary?: any;
  onPress?: any;
  selected?: any
}

export function TitleView({ title, subTitle, primary, onPress, selected }: TitleViewProps) {
  const { textRtlStyle, isDark, viewRtlStyle, rtl } = useValues()
  const { translateData } = useSelector((state: any) => state.setting)

  return (
    <View>
      <View style={[{ flexDirection: viewRtlStyle }, styles.view]}>
        <Text
          style={[
            styles.main,
            {
              color: isDark ? appColors.white : appColors.subFont,
              textAlign: textRtlStyle,
            },
          ]}
        >
          {title}
        </Text>
        {primary &&
          <View style={[{ flexDirection: viewRtlStyle }, styles.view, { marginTop: windowHeight(0.5) }]}>
            <View style={{ marginTop: windowHeight(1) }}>
              <CustomRadioButton onPress={onPress} selected={selected} />
            </View>
            <Text style={[styles.sub, { textAlign: textRtlStyle }, {
              color: appColors.primary, marginBottom: 0,
              fontSize: fontSizes.FONT4,
              marginLeft: rtl ? 0 : windowWidth(-2),
              marginRight: rtl ? windowWidth(-2) : 0,
            }]}>{translateData.setAsPrimary}</Text>
          </View>
        }
      </View>
      <Text style={[styles.sub, { textAlign: textRtlStyle }]}>{subTitle}</Text>
    </View>
  )
}

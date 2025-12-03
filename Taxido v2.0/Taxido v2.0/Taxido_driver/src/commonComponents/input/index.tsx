import { useTheme } from '@react-navigation/native'
import React from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import appColors from '../../theme/appColors'
import { useValues } from '../../utils/context'
import styles from './styles'
import InputProps from './types'
import { windowHeight, windowWidth } from '../../theme/appConstant'
import appFonts from '../../theme/appFonts'


export function Input({
  placeholder,
  keyboardType,
  value,
  autoCapitalize,
  textAlignVertical,
  numberOfLines,
  multiline,
  warning,
  onChangeText,
  style,
  showWarning,
  icon,
  iconText,
  titleShow,
  title,
  backgroundColor,
  rightIcon,
  onPress,
  secureText,
  borderColor,
  editable,
  ref
}: InputProps) {

  const { colors } = useTheme()
  const { textRtlStyle, viewRtlStyle, isDark, rtl } = useValues()


  return (
    <View style={styles.container}>
      {titleShow && (
        <Text
          style={{
            marginBottom: windowHeight(1),
            color: isDark ? appColors.white : appColors.primaryFont,
            fontFamily: appFonts.medium,
            textAlign: textRtlStyle,
          }}
        >
          {title}
        </Text>
      )}

      <View
        style={[
          styles.subContainer,
          { borderColor: borderColor ? borderColor : colors.border },
        ]}
      >
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor:
                backgroundColor ||
                (isDark ? appColors.primaryFont : appColors.graybackground),
            },
            { flexDirection: viewRtlStyle },
          ]}
        >
          {icon && <View style={[styles.iconContainer]}>{icon}</View>}
          {iconText && <Text style={{ marginLeft: windowWidth(4), color: isDark ? appColors.darkText : appColors.secondaryFont }}>{iconText}</Text>}
          <TextInput
          ref={ref}
            editable={editable}
            style={[
              styles.input,
              style,
              { marginHorizontal: icon ? windowHeight(0) : windowHeight(1.5) },
              {
                backgroundColor:
                  backgroundColor ||
                  (isDark ? appColors.primaryFont : appColors.graybackground),
                textAlign: textRtlStyle,

                color:
                  editable === false
                    ? appColors.secondaryFont
                    : isDark
                      ? appColors.white
                      : appColors.black,

              },
            ]}
            placeholder={placeholder}
            placeholderTextColor={
              isDark ? appColors.darkText : appColors.secondaryFont
            }
            keyboardType={keyboardType}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={secureText}
            autoCapitalize={autoCapitalize}
            multiline={multiline}
            numberOfLines={numberOfLines}
            textAlignVertical={textAlignVertical}
          />

          {rightIcon && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onPress}
              style={{
                position: 'absolute',
                right: windowHeight(1.5),
                top: '50%',
                transform: [{ translateY: -12 }],
              }}
            >
              {rightIcon}
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={[styles.errorContainer]}>
        {showWarning && (
          <Text style={[styles.warning, { textAlign: textRtlStyle }]}>
            {warning}
          </Text>
        )}
      </View>
    </View>
  )
}

import React from 'react'
import { TouchableOpacity, View, Text, Image } from 'react-native'
import Icons from '../../../../../utils/icons/icons'
import styles from './styles'
import { DocumentPickerResponse } from 'react-native-document-picker'
import { useTheme } from '@react-navigation/native'
import appColors from '../../../../../theme/appColors'
import { fontSizes, windowHeight, windowWidth } from '../../../../../theme/appConstant'
import appFonts from '../../../../../theme/appFonts'
import { useValues } from '../../../../../utils/context'
import { Props } from './type'
import { useSelector } from 'react-redux'


const renderDocumentUpload = ({
  uploadedDocuments,
  handleDocumentUpload,
  documentType,
  label,
  expiryDate = '',
  needExpiryDate = false,
  onPressDate,
}: Props) => {

  const { colors } = useTheme();
  const { textRtlStyle } = useValues();
  const { translateData } = useSelector((state: any) => state.setting);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={{
        backgroundColor: colors.card,
        height: needExpiryDate ? windowHeight(31) : windowHeight(16.8),
        borderRadius: windowHeight(0.8),
        borderWidth: windowHeight(0.1),
        borderColor: colors.border
      }}
      onPress={() => handleDocumentUpload(documentType)}
    >
      <Text style={styles.label1}>{label}</Text>

      {uploadedDocuments[documentType] &&
        Array.isArray(uploadedDocuments[documentType]) ? (
        (uploadedDocuments[documentType] as DocumentPickerResponse[])?.map((document, index) => (
          <Image
            key={index}
            source={{ uri: document.uri }}
            style={[styles.innerContainerImage, { borderColor: colors.border }]}
          />
        ))
      ) : (
        <View style={[styles.innerContainer, { borderColor: colors.border }]}>
          <View style={styles.download}>
            <Icons.Download color={appColors.secondaryFont} />
          </View>
          <Text style={styles.label}>{label}</Text>
        </View>
      )}

      {needExpiryDate && (
        <>
          <Text
            style={{
              marginTop: windowHeight(2),
              marginBottom: windowHeight(0.8),
              marginHorizontal: windowHeight(1.5),
              textAlign: textRtlStyle,
              color: colors.text,
              fontSize: fontSizes.FONT3HALF,
              fontFamily: appFonts.medium,
            }}
          >
            {translateData?.expiryDate}
          </Text>

          <TouchableOpacity
            style={styles.dateView}
            onPress={() => onPressDate?.(documentType)}
            activeOpacity={0.7}
          >
            <Text
              style={{
                color: colors.text,
                fontSize: fontSizes.FONT3HALF,
                fontFamily: appFonts.regular,
                marginHorizontal: windowWidth(2)
              }}
            >
              {expiryDate ? expiryDate : translateData?.expiryDate}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </TouchableOpacity>
  );
};

export default renderDocumentUpload;

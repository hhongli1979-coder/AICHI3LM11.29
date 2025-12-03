import { Text, View, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import { Download } from '@utils/icons';
import { styles } from './styles';
import { useValues } from "@src/utils/context/index";
import { appColors } from '@src/themes';
import { useSelector } from 'react-redux';

export function PictureCargo({ onImageSelect, service_name }) {
  const { textColorStyle, isDark, bgContainer, textRTLStyle } = useValues();
  const [image, setimage] = useState(null);
  const { translateData } = useSelector((state) => state.setting);


  const openImagePicker = () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 300,
      quality: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
      } else if (response.errorMessage) {
      } else if (response.assets && response.assets.length > 0) {
        const source = { uri: response.assets[0].uri };
        setimage(source.uri)
        onImageSelect(response.assets);
      } else {
      }
    });
  };


  return (
    <TouchableOpacity activeOpacity={0.7}
      onPress={openImagePicker}>
      {service_name === 'freight' ? (
        <Text style={[styles.cargoText, { color: textColorStyle }, { textAlign: textRTLStyle }]}>
          {translateData.pictureOfYourCargo}
        </Text>
      ) : service_name === 'parcel' ? (
        <Text style={[styles.cargoText, { color: textColorStyle }, { textAlign: textRTLStyle }]}>
          {translateData.pictureOfYourPackedParcel}
        </Text>
      ) : null}

      <View style={[styles.cargoView, { backgroundColor: bgContainer, borderColor: isDark ? appColors.darkBorder : appColors.border }]}>
        {image ? (
          <Image source={{ uri: image }} style={styles.selectedImage} />
        ) : (
          <>
            <View style={styles.dashedBorder}>
              <Download />
              <Text style={styles.uploadText}>{translateData.updateTextBottom}</Text>
            </View>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

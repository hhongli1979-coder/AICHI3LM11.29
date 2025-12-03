import { ScrollView, View } from "react-native";
import React from "react";
import { commonStyles } from "../../styles/commonStyle";
import { external } from "../../styles/externalStyle";
import { styles } from "./style";
import { Header, Button, InputText } from "@src/commonComponent";
import { useValues } from '@src/utils/context/index';
import { Country } from "@utils/icons";
import { useAppNavigation } from "@src/utils/navigation";
import { useSelector } from "react-redux";

export function AddLocation() {
  const { bgFullStyle, textColorStyle, linearColorStyle } = useValues();
  const { goBack } = useAppNavigation();
  const { translateData } = useSelector((state: any) => state.setting);

  return (
    <View
      style={[
        commonStyles.flexContainer,
        { backgroundColor: linearColorStyle },
      ]}
    >
      <Header
        value={translateData.addLocation}
        container={
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={[external.mh_20]}
            contentContainerStyle={styles.containerStyle}
          >
            <InputText
              title={translateData.bankName}
              placeholder={translateData.enterTitleName}
              showTitle={true}
              backgroundColor={bgFullStyle}
              placeholderTextColor={textColorStyle}
              icon={<Country />}
              show
            />
            <InputText
              title={translateData.holderName}
              placeholder={translateData.enterAddress}
              showTitle={true}
              backgroundColor={bgFullStyle}
              placeholderTextColor={textColorStyle}
              icon={<Country />}
              show
            />
            <InputText
              title={translateData.ifscCode}
              placeholder={translateData.enterPinCode}
              showTitle={true}
              backgroundColor={bgFullStyle}
              placeholderTextColor={textColorStyle}
              icon={<Country />}
              show
            />
            <InputText
              title={translateData.accountNo}
              placeholder={translateData.enterCityName}
              showTitle={true}
              backgroundColor={bgFullStyle}
              placeholderTextColor={textColorStyle}
              icon={<Country />}
              show
            />

            <InputText
              title={translateData.swiftCode}
              placeholder={translateData.enterStateName}
              showTitle={true}
              backgroundColor={bgFullStyle}
              placeholderTextColor={textColorStyle}
              icon={<Country />}
              show
            />
            <InputText
              title={translateData.swiftCode}
              placeholder={translateData.enterCountryName}
              showTitle={true}
              backgroundColor={bgFullStyle}
              placeholderTextColor={textColorStyle}
              icon={<Country />}
              show
            />
          </ScrollView>
        }
      />
      <View style={styles.container}>
        <Button title={translateData.add} onPress={() => goBack()} />
      </View>
    </View>
  );
}

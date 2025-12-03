import { View } from "react-native";
import React, { useState } from "react";
import { external } from "../../styles/externalStyle";
import { Calender } from "@utils/icons";
import { CommonModal, Button, InputText } from "@src/commonComponent";
import { useValues } from '@src/utils/context/index';
import { Calander } from "@src/screens";
import styles from "./styles";
import { useAppNavigation } from "@src/utils/navigation";
import { useSelector } from "react-redux";

export function OutStationDetails() {
  const { navigate }: any = useAppNavigation();
  const [selected, setSelected] = useState<boolean>(false);
  const { bgContainer } = useValues();
  const { translateData } = useSelector((state: any) => state.setting);

  const closemenu = () => {
    setSelected(false);
  };

  return (
    <View>
      <InputText
        showTitle={true}
        title={translateData.dateAndTimeText}
        backgroundColor={bgContainer}
        placeholder={translateData.selectDateTimeT}
        rightIcon={<Calender />}
        onPress={() => setSelected(true)}
      />
      <InputText
        showTitle={true}
        title={translateData.numberOfPassengerText}
        backgroundColor={bgContainer}
        placeholder={translateData.enterTotalPassengerNo}
        keyboard={"number-pad"}
      />
      <InputText
        showTitle={true}
        title={translateData.enterYourOfferRate}
        backgroundColor={bgContainer}
        placeholder={translateData.enterFareAmount}
        keyboard={"number-pad"}
      />
      <InputText
        showTitle={true}
        title={translateData.commentsText}
        backgroundColor={bgContainer}
        placeholder={translateData.enterYourComments}
      />
      <View style={[external.mv_15, external.mt_25]}>
        <Button
          title={translateData.bookRideText}
          onPress={() => navigate("FindingDriver", { isOutstation: true })}
        />
      </View>
      <CommonModal
        isVisible={selected}
        onPress={() => setSelected(false)}
        value={
          <View>
            <Calander onPress={closemenu} />
            <View style={styles.mv}>
              <Button title={translateData.continueText} onPress={() => setSelected(false)} />
            </View>
          </View>
        }
      />
    </View>
  );
}

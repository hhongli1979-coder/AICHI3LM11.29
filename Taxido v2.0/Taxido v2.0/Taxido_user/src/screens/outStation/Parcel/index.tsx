import { View } from 'react-native';
import React, { useState } from 'react';
import { MinimumPrice } from '../../../components/minimumPrice/index';
import { external } from '../../../styles/externalStyle';
import { InputText, Button, ToggleMenu, CommonModal } from '@src/commonComponent';
import { PickUpDetails } from '../../../components/pickUpDetails/index';
import { Calender } from '@utils/icons';
import { useValues } from "@src/utils/context/index";
import Calander from '../../dateTimeSchedule/index';
import { useAppNavigation } from '@src/utils/navigation';
import { useSelector } from 'react-redux';


export function Parcel() {
  const { navigate } = useAppNavigation();
  const [selected, setSelected] = useState(false);
  const [selectedGender, setSelectedGender] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { translateData } = useSelector((state) => state.setting);
  const { bgContainer } = useValues();

  const handleSelectGender = (gender: string) => {
    setSelectedGender(gender);
    setIsMenuOpen(false);
  };
  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  const closeModal = () => {
    setSelected(false)
  };

  return (
    <View>
      <MinimumPrice />
      <PickUpDetails bgColor={bgContainer} />
      <InputText
        showTitle={true}
        title={translateData.dateAndTime}
        backgroundColor={bgContainer}
        placeholder={translateData.selectDateTime}
        rightIcon={<Calender />}
        onPress={() => setSelected(true)}
      />
      <InputText
        showTitle={true}
        title={translateData.weight}
        backgroundColor={bgContainer}
        placeholder={translateData.enterTotalWeight}
      />

      <InputText
        showTitle={true}
        title={translateData.comments}
        backgroundColor={bgContainer}
        placeholder={translateData.enterComments}
      />
      <InputText
        showTitle={true}
        title={translateData.enterRate}
        backgroundColor={bgContainer}
        placeholder={translateData.enterAmount}
      />
      <ToggleMenu
        titleShow={true}
        title={translateData.paymentMethod}
        initialPlaceholder={translateData.cash}
        options={['Cash', 'UPI', 'QR-Code']}
        onSelect={handleSelectGender}
        onCloseMenu={handleCloseMenu}
        position={true}
        iconShow={true}
      />
      <View style={[external.mv_15]}>
        <Button title={translateData.bookRide} onPress={() => navigate('FindingDriver')} />
      </View>
      <CommonModal
        isVisible={selected}
        onPress={() => setSelected(false)}
        value={
          <View>
            <Calander onPress={closeModal} />
            <View style={{ marginVertical: 20, }}>
              <Button title={translateData.continue} onPress={() => setSelected(false)} />
            </View>
          </View>
        }
      />
    </View>
  );
};

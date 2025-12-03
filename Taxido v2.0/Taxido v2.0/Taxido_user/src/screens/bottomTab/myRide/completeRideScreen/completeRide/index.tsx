import { ScrollView, View, Text, Modal, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import RideContainer from '../../rideContainer';
import { Header, Button } from '@src/commonComponent';
import { RideDetails } from '../rideDetails/index';
import { external } from '../../../../../styles/externalStyle';
import { appColors } from '@src/themes';
import { useValues } from '@src/utils/context/index';
import cancelReason from '../../../../rideActive/data';
import styles from '../../../../rideActive/styles'
import { Close } from '../../../../../assets/icons/close';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

export function CompleteRide() {
  const { textColorStyle, linearColorStyle, textRTLStyle, viewRTLStyle, bgContainer } = useValues();
  const [modalCancelVisible, setModalCancelVisible] = useState(false);
  const { navigate } = useNavigation();
  const { translateData } = useSelector((state) => state.setting);

  const handlePreeCancel = () => {
    setModalCancelVisible(true);
  };

  const gotoHelp = () => {
    navigate('ChatScreen')
    setModalCancelVisible(false);
  }

  return (
    <Header
      value={translateData.completeRides}
      container={
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[external.Pb_80]}>
          <RideContainer mapShow={true} status={translateData.completed} color={appColors.completeColor} />
          <RideDetails />
          <TouchableOpacity onPress={handlePreeCancel} style={styles.helpView} activeOpacity={0.7}
          >
            <Text style={styles.needHelpText}>{translateData.needHelp}</Text>
          </TouchableOpacity>
          <Modal
            transparent={true}
            visible={modalCancelVisible}
            onRequestClose={() => {
              setModalCancelVisible(false);
            }}
          >
            <View style={styles.modalBg}>
              <View style={[styles.modalBgMain, { backgroundColor: linearColorStyle }]}>
                <TouchableOpacity style={styles.close} onPress={() => setModalCancelVisible(false)} activeOpacity={0.7}
                >
                  <Close />
                </TouchableOpacity>
                <Text style={[styles.cancelTitle, { color: textColorStyle }]}>{translateData.whyCancel}</Text>
                {cancelReason?.map(item => (
                  <TouchableOpacity key={item.id} style={[styles.container2, { backgroundColor: bgContainer, flexDirection: viewRTLStyle }]} onPress={gotoHelp} activeOpacity={0.7}>
                    <View style={[styles.iconContainer, { flexDirection: viewRTLStyle }]}>
                      {item.icon}
                      <View style={styles.border} />
                    </View>
                    <View style={styles.textContainer}>
                      <Text style={[styles.text, { color: textColorStyle, textAlign: textRTLStyle }]}>{item.text}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
                <Button backgroundColor={appColors.primary} width={300} title={translateData.close} onPress={() => setModalCancelVisible(false)}
                />
              </View>
            </View>
          </Modal>
          <View style={[external.mh_20, external.mt_10, external.mb_20]}>
            <Button title={translateData.downloadInvoice} />
          </View>
        </ScrollView>
      }
    />
  );
};

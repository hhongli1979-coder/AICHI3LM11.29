import { View, Image } from 'react-native';
import React from 'react';
import { external } from '../../../../styles/externalStyle';
import { Notification, Wallet } from '@utils/icons';
import { IconBackground } from '@src/commonComponent';
import { styles } from './style';
import { appColors } from '@src/themes';
import Images from '@utils/images';
import { getValue, setValue } from '@src/utils/localstorage';
import { useSelector } from 'react-redux';
import { useAppNavigation } from '@src/utils/navigation';
import { useValues } from '@src/utils/context/index';

export function HeaderComponent() {
  const { navigate, replace } = useAppNavigation();
  const { viewRTLStyle } = useValues();
  const { settingData } = useSelector((state: any) => state.setting);

  const gotoWallet = async () => {
    let token = "";
    ;

    await getValue("token").then(function (value) {
      token = value ?? "";
    });
    if (token) {
      navigate("Wallet");
    } else {
      let screenName = "Wallet";

      if (settingData.values.activation.login_number == 1) {
        setValue("CountinueScreen", screenName);
        replace("SignIn");
      } else if (settingData.values.activation.login_number == 0) {
        setValue("CountinueScreen", screenName);
        replace("SignInWithMail");
      }
      else {
        replace("SignIn");
      }
    }
  };

  return (
    <View
      style={[
        external.fd_row,
        external.js_space,
        external.ai_center,
        { flexDirection: viewRTLStyle },
      ]}
    >
      <Image source={Images.splash} style={styles.logo} />
      <View style={[external.fd_row, external.ai_center]}>
        <View style={[external.mh_8]}>
          <IconBackground
            icon={<Notification />
            }
            borderColor={appColors.categoryTitle}
            onPress={() => navigate("Notifications")}
          />
        </View>
        <IconBackground
          icon={<Wallet />}
          borderColor={appColors.categoryTitle}
          onPress={gotoWallet}
        />
      </View>
    </View>
  );
}

import { View, Text, TextInput, FlatList, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import styles from "./styles";
import { useNavigation, useTheme } from "@react-navigation/native";
import { useValues } from "@src/utils/context/index";;
import { appColors } from "@src/themes";
import { Button, RadioButton } from "@src/commonComponent";
import { DollarCoin } from "@src/utils/icons";
import { useDispatch, useSelector } from "react-redux";
import { paymentsData, walletTopUpData } from "../../../../api/store/actions/index";
import { WalletTopUpDatainterface } from "@src/api/interface/walletInterface";
import { CustomBackHandler } from "@src/components";

const SelectMethod = () => {
  const { colors } = useTheme();
  const { viewRTLStyle } = useValues();
  const [amount, setAmount] = useState();
  const { paymentMethodData } = useSelector((state: any) => state.payment);
  const activePaymentMethods = paymentMethodData?.data?.filter((method: any) => method?.status === true);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const dispatch = useDispatch();
  const { navigate } = useNavigation();
  const { translateData } = useSelector((state: any) => state.setting);
  const [topupLoading, setTopuploading] = useState(false);
  const { zoneValue } = useSelector((state: any) => state.zone);

  useEffect(() => {
    dispatch(paymentsData());
  }, []);

  const paymentData = (index: number, name: any) => {
    setSelectedItem(index === selectedItem ? null : index);
    setSelectedPaymentMethod(index === selectedItem ? null : name);
  };

  const addBalance = () => {
    setTopuploading(true)
    let payload: WalletTopUpDatainterface = {
      amount: amount,
      payment_method: selectedPaymentMethod,
      currency_code: zoneValue?.currency_code,
      currency_symbol: zoneValue?.currency_symbol
    };


    dispatch(walletTopUpData(payload))
      .unwrap()
      .then(async (res: any) => {
        setTopuploading(false)
        if (res.is_redirect) {
          navigate("PaymentWebView", { url: res.url, selectedPaymentMethod: selectedPaymentMethod, dataValue: res });
        }
      });
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => {
        if (!topupLoading) {
          paymentData(index, item?.slug);
        }
      }}
      activeOpacity={topupLoading ? 1 : 0.7}
    >

      <View
        style={[
          styles.modalPaymentView,
          { backgroundColor: appColors.lightGray, flexDirection: viewRTLStyle },
        ]}
      >
        <CustomBackHandler />
        <View style={{ flexDirection: viewRTLStyle, flex: 1 }}>
          <View style={styles.imageBg}>
            <Image source={{ uri: item.image }} style={styles.paymentImage} />
          </View>
          <View style={styles.mailInfo}>
            <Text style={[styles.mail, { color: appColors.primaryText }]}>
              {item.name}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.payBtn} activeOpacity={0.7}>
          <RadioButton
            checked={index === selectedItem}
            color={appColors.primary}
          />
        </TouchableOpacity>
      </View>
      {index !== 3 ? <View style={styles.borderPayment} /> : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.mainContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{translateData.selectMethod}</Text>
      </View>
      <View
        style={[
          styles.container,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <FlatList
          data={activePaymentMethods}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={true}
          showsVerticalScrollIndicator={true}
        />
      </View>
      <View style={styles.dashBorder} />
      <Text style={styles.titleTopup}>{translateData.addTopupBalanceText}</Text>
      <Text style={styles.titleAmount}>{translateData.enterAmount}</Text>
      <View
        style={[
          styles.inputView,
          {
            backgroundColor: colors.card,
            flexDirection: viewRTLStyle,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.icons}>
          <DollarCoin />
        </View>
        <TextInput
          style={[
            styles.textinput,
            { backgroundColor: colors.card, color: colors.text },
          ]}
          placeholder={translateData.amount}
          placeholderTextColor={appColors.regularText}
          keyboardType={"numeric"}
          value={amount}
          onChangeText={(text) => setAmount(text)}
        />
      </View>
      <View style={styles.addBtn}>
        <Button title={translateData.addBalance} onPress={addBalance} loading={topupLoading} />
      </View>
    </View>
  );
};

export default SelectMethod;

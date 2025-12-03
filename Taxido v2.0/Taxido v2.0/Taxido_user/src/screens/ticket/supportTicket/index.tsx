import { View, Text, TouchableOpacity, TouchableWithoutFeedback, FlatList, Image } from "react-native";
import React from "react";
import { Back, Info } from "@src/utils/icons";
import { Add } from "@src/utils/icons";
import { appColors, appFonts, windowHeight } from "@src/themes";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import Images from "@src/utils/images";
import styles from "./styles";
import { useValues } from "@src/utils/context/index";;
import { external } from "@src/styles/externalStyle";
import { TicketLoader } from "./TicketLoader";

export function SupportTicket() {
  const { navigate, goBack } = useNavigation();
  const { ticketData, loading } = useSelector((state: any) => state.tickets);
  const { textColorStyle, isDark, viewRTLStyle, bgFullStyle } = useValues();
  const { translateData } = useSelector((state) => state.setting);

  const gotoAdd = () => {
    navigate("CreateTicket");
  };

  const gotoDetails = (value) => {
    navigate("TicketDetails", { ticketData: value });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderTicketItem = ({ item }: { item: any }) => {
    return (
      <View style={styles.renderTicketItemView}>
        <TouchableWithoutFeedback onPress={() => gotoDetails(item)}>
          <View style={[styles.ticketContainer, {
            backgroundColor: bgFullStyle,
            borderColor: isDark ? appColors.darkBorder : appColors.border,
          },]}>
            <View style={[styles.row, { flexDirection: viewRTLStyle }]}>
              <View style={styles.formatDateView}>
                <Text style={styles.ticketStyle}>#{item?.ticket_number}</Text>
                <Text style={styles.createdAt}>
                  {formatDate(item?.created_at)}
                </Text>
              </View>
              <View style={styles.status_Container}>
                <View style={styles.statusContainer}>
                  <Text style={styles.statusText}>
                    {item?.ticketStatus?.name}
                  </Text>
                </View>
              </View>
            </View>
            <Text style={[styles.subjectText, { color: isDark ? appColors.whiteColor : appColors.primaryText, }]}>{item?.subject}</Text>
            <Text style={styles.desText}>
              {item?.messages[0].message.length > 80
                ? `${item?.messages[0].message.substring(0, 80)}...`
                : item?.messages[0].message}
            </Text>
            <View style={[styles.departmentView, { borderColor: isDark ? appColors.darkBorder : appColors.border }]} />
            <View style={[{ flexDirection: viewRTLStyle }]}>
              <View style={styles.departSubView}>
                <Text
                  style={{
                    color: appColors.darkPurpal,
                    fontFamily: appFonts.regular,
                  }}
                >
                  {item?.department.name}
                </Text>
              </View>
              <View style={styles.priorityView}>
                <Text style={styles.priorityText}>{item?.priority.name}</Text>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  };

  return (
    <View style={external.main}>
      <View
        style={{
          backgroundColor: isDark ? appColors.darkHeader : appColors.whiteColor,
        }}
      >
        <View style={[styles.headerView, { flexDirection: viewRTLStyle }]}>
          <TouchableOpacity
            activeOpacity={0.7}

            style={[
              styles.backButton,
              { borderColor: isDark ? appColors.darkBorder : appColors.border },
            ]}
            onPress={() => goBack()}
          >
            <Back />
          </TouchableOpacity>
          <Text style={[styles.title, { color: textColorStyle }]}>
            {translateData.supportTicket}
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}

            style={[
              styles.addBtn,
              { borderColor: isDark ? appColors.darkBorder : appColors.border },
            ]}
            onPress={gotoAdd}
          >
            <Add colors={textColorStyle} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{
        backgroundColor: isDark ? appColors.primaryText : appColors.lightGray,
        flex: 1
      }}>
        {loading ? (
          Array.from({ length: 2 }).map((_, index) => (
            <View key={index} style={{ marginBottom: windowHeight(1) }}>
              <TicketLoader />
            </View>
          ))
        ) : ticketData?.data?.length > 0 ? (
          <FlatList
            data={ticketData?.data}
            renderItem={renderTicketItem}
            keyExtractor={(item) => item?.id.toString()}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View
            style={[
              styles.ticketSubContainer,
              {
                backgroundColor: isDark
                  ? appColors.primaryText
                  : appColors.lightGray,
              },
            ]}
          >
            <Image
              source={isDark ? Images.noTicketDark : Images.noTicket}
              style={styles.noImg}
            />
            <View style={[styles.emptyTicketView, { flexDirection: viewRTLStyle }]}>
              <Text style={[styles.emptyTicket, { color: textColorStyle }]}>
                {translateData.noTicket}
              </Text>
              <View style={styles.marginHr}>
                <Info />
              </View>
            </View>
            <Text style={styles.noTicketText}>{translateData.noTicketDes}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

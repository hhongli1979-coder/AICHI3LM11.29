import { View, Text, TouchableOpacity, TouchableWithoutFeedback, FlatList, Image, BackHandler } from 'react-native'
import React, { useEffect } from 'react'
import appColors from '../../../../theme/appColors'
import Icons from '../../../../utils/icons/icons'
import { useTheme } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import Images from '../../../../utils/images/images'
import { Menu, MenuOptions, MenuTrigger, renderers } from 'react-native-popup-menu'
import commonStyles from '../../../../style/commanStyles'
import styles from './styles'
import { useValues } from '../../../../utils/context'
import { TicketLoader } from './TicketLoader'
import { useAppNavigation } from '../../../../utils/navigation'

export function SupportTicket() {
  const { colors } = useTheme()
  const navigation = useAppNavigation()
  const { viewRtlStyle, isDark, textRtlStyle } = useValues()
  const { ticketData, statusCode, loading } = useSelector((state: any) => state.tickets)
  const { translateData } = useSelector((state: any) => state.setting)

  const gotoAdd = () => {
    navigation.navigate('CreateTicket')
  }

  const gotoDetails = (value: any) => {
    navigation.navigate('TicketDetails', { ticketData: value })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }


  useEffect(() => {
    const backAction = () => {
      if (navigation.canGoBack()) {
        navigation.goBack();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

  const { Popover } = renderers

  const renderTicketItem = ({ item }: any) => {
    return (
      <View style={styles.containerMain}>
        <TouchableWithoutFeedback onPress={() => gotoDetails(item)}>
          <View
            style={[
              styles.ticketContainer,
              { backgroundColor: isDark ? colors.card : appColors.white },
              { borderColor: colors.border },
            ]}
          >
            <View
              style={[
                styles.created_Main_Container,
                { flexDirection: viewRtlStyle },
              ]}
            >
              <View style={styles.created_Container}>
                <Text style={[styles.ticketText, { textAlign: textRtlStyle }]}>
                  {item.ticket_number}
                </Text>
                <Text
                  style={[styles.created_at_Text, { textAlign: textRtlStyle }]}
                >
                  {formatDate(item.created_at)}
                </Text>
              </View>
              <View style={styles.ticket_Container}>
                <View style={styles.ticket_status_Container}>
                  <Text style={styles.ticket_status}>
                    {item?.ticketStatus.name}
                  </Text>
                </View>
              </View>
            </View>
            <Text
              style={[
                styles.subjectText,
                {
                  color: isDark ? appColors.white : appColors.primaryFont,
                  textAlign: textRtlStyle,
                },
              ]}
            >
              {item.subject}
            </Text>
            <Text style={[styles.messageText, { textAlign: textRtlStyle }]}>
              {item.messages[0].message.length > 80
                ? `${item.messages[0].message.substring(0, 80)}...`
                : item.messages[0].message}
            </Text>
            <View
              style={[
                styles.container,
                {
                  borderColor: colors.border,
                },
              ]}
            />
            <View style={{ flexDirection: viewRtlStyle }}>
              <View style={styles.departmentContainer}>
                <Text style={styles.departmentText}>
                  {item.department.name}
                </Text>
              </View>
              <View style={styles.priorityContainer}>
                <Text style={styles.priorityText}>{item.priority.name}</Text>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  return (
    <View style={styles.mainContainer}>
      <View style={{ backgroundColor: colors.card }}>
        <View style={[styles.headerContainer, { flexDirection: viewRtlStyle }]}>
          <TouchableOpacity
            activeOpacity={0.7}

            onPress={() => navigation.goBack()}
            style={[styles.header, { borderColor: colors.border }]}
          >
            <Icons.Back
              color={isDark ? appColors.white : appColors.primaryFont}
            />
          </TouchableOpacity>
          <Text
            style={[
              styles.text,
              { color: isDark ? colors.text : appColors.primaryFont },
            ]}
          >
            {translateData.supportTicket}
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.header, { borderColor: colors.border }]}
            onPress={gotoAdd}
          >
            <Icons.Add
              color={isDark ? appColors.white : appColors.primaryFont}
            />
          </TouchableOpacity>
        </View>
      </View>
      {loading ? (
        [...Array(2)].map((_, index) => <TicketLoader key={index} />)
      ) : ticketData?.data?.length > 0 ? (
        <FlatList
          data={ticketData?.data}
          renderItem={renderTicketItem}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainerStyle}
        />
      ) : (
        <View style={styles.imgContainer}>
          <Image
            source={isDark ? Images.noTicketDark : Images.noTicket}
            style={styles.image}
          />
          <View style={[styles.textContainer, { flexDirection: viewRtlStyle }]}>
            <Text
              style={[
                styles.emptyTicket,
                {
                  color: isDark ? appColors.white : appColors.primaryFont,
                },
              ]}
            >
              {translateData.emptyTicket}
            </Text>
            <Menu
              renderer={Popover}
              rendererProps={{
                preferredPlacement: 'bottom',
              }}
            >
              <MenuTrigger style={styles.menuTrigger}>
                <Icons.Info />
              </MenuTrigger>
              <MenuOptions
                customStyles={{ optionsContainer: commonStyles.popupContainer }}
              >
                <Text
                  style={commonStyles.popupText}
                >{`${translateData.statusCode} ${statusCode}`}</Text>
              </MenuOptions>
            </Menu>
          </View>
          <Text style={styles.noTicketText}>{translateData.noTicket}</Text>
        </View>
      )}
    </View>
  )
}

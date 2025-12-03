import React, { useEffect, useState, useMemo, memo } from 'react'
import { FlatList, Pressable, ScrollView, Text, View } from 'react-native'
import appColors from '../../../theme/appColors'
import { styles } from './styles'
import { ActiveRide } from './activeRide/index'
import { PendingRide } from './pendingRide/index'
import { CompletedRide } from './completedRide/index'
import { CancelRide } from './cancelRide/index'
import { useValues } from '../../../utils/context'
import { useTheme } from '@react-navigation/native'
import { useLoadingContext } from '../../../utils/loadingContext'
import { LoaderStatus } from './loaderStatus'
import { ScheduleRide } from './scheduleRide'
import { windowHeight } from '../../../theme/appConstant'

const MemoizedScheduleRide = memo(ScheduleRide);
const MemoizedPendingRide = memo(PendingRide);
const MemoizedActiveRide = memo(ActiveRide);
const MemoizedCompletedRide = memo(CompletedRide);
const MemoizedCancelRide = memo(CancelRide);

export function RideStatus() {
  const { rtl, isDark } = useValues()
  const [selected, setSelected] = useState(0)
  const { colors } = useTheme()
  const [loading, setLoading] = useState(false)
  const loadingContext: any = useLoadingContext()
  const { addressLoaded, setAddressLoaded } = loadingContext || {}
  const rideStatusData = useMemo(() => [
    {
      id: 0,
      title: 'Upcoming',
    },
    {
      id: 1,
      title: 'Active',
    },
    {
      id: 2,
      title: 'Past',
    },
  ], [])

  useEffect(() => {
    if (!addressLoaded) {
      setLoading(true)
      setLoading(false)
      setAddressLoaded && setAddressLoaded(true)
    }
  }, [addressLoaded, setAddressLoaded])

  const renderItem = useMemo(() => {
    return ({ item }: { item: any }) => (
      <View style={{ backgroundColor: isDark ? appColors.bgDark : appColors.white, borderRadius: windowHeight(5) }}>
        <Pressable
          onPress={() => setSelected(item.id)}
          style={[
            styles.container,
            {
              backgroundColor: item.id === selected
                ? appColors.primary
                : isDark
                  ? appColors.bgDark
                  : appColors.white,
              borderColor: colors.border,
            },
            item.id === selected ? { borderColor: appColors.primary } : null,
          ]}
        >
          <Text
            style={[
              styles.mediumTextBlack12,
              item.id === selected
                ? { color: appColors.white }
                : { color: appColors.primary },
            ]}
          >
            {item?.title}
          </Text>
        </Pressable>
      </View>
    )
  }, [selected, isDark, colors, rtl])

  const renderRideComponents = useMemo(() => {
    switch (selected) {
      case 0:
        return <MemoizedScheduleRide />
      case 1:
        return (
          <View>
            <MemoizedPendingRide />
            <MemoizedActiveRide />
          </View>
        )
      case 2:
        return (
          <View>
            <MemoizedCompletedRide />
            <MemoizedCancelRide />
          </View>
        )
      default:
        return <MemoizedScheduleRide />
    }
  }, [selected])

  return (
    <View style={{ backgroundColor: isDark ? colors.background : appColors.graybackground }}>
      {loading ? (
        <LoaderStatus />
      ) : (
        <View style={[styles.listContainer, { backgroundColor: isDark ? appColors.bgDark :appColors.white, }]}>
          <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal
            renderItem={renderItem}
            data={rideStatusData}
            inverted={rtl}
            initialNumToRender={3}
            maxToRenderPerBatch={3}
            contentContainerStyle={{ justifyContent: 'space-between', width: '100%' }}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
      )}

      <ScrollView showsHorizontalScrollIndicator={false}>
        {renderRideComponents}
      </ScrollView>
    </View>
  )
}

export default memo(RideStatus)
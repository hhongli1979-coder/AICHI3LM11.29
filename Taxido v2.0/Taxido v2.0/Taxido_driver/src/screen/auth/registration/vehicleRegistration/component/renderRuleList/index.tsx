import React from 'react'
import { TouchableOpacity, View, Text } from 'react-native'
import styles from './styles'
import { CustomCheckbox } from '../../../component'
import { useValues } from '../../../../../../utils/context'
import { windowHeight } from '../../../../../../theme/appConstant'


interface RuleItemProps {
  item: { id: number; text: string, title?: string }
  selectedIds: number[]
  handleCheckboxPress: any
}

export function RenderRuleList({
  item,
  selectedIds,
  handleCheckboxPress,
}: RuleItemProps) {
  const { viewRtlStyle } = useValues()
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => handleCheckboxPress(item.id, item.text)}
    >
      <View style={[styles.main, { flexDirection: viewRtlStyle }]}>
        <Text style={styles.title}>{item.title}</Text>
        <View style={{ marginEnd: windowHeight(0) }}>
          <CustomCheckbox
            label=""
            checked={selectedIds.includes(item.id)}
            onPress={() => handleCheckboxPress(item.id)}
          />
        </View>
      </View>
    </TouchableOpacity>
  )
}

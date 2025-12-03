import { View, Text, ScrollView, LayoutChangeEvent } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Header } from '../../../../commonComponents';
import styles from './styles';
import ProgressBarSvg from './ProgressBarSvg';
import { useRoute } from '@react-navigation/native';
import { useValues } from '../../../../utils/context';
import appColors from '../../../../theme/appColors';
import { useSelector } from 'react-redux';

export function IncentiveTask() {
    const route = useRoute<any>();
    const { tasks = [], data: completedRides = 0 } = route.params || {};
    const { isDark } = useValues();
    const { translateData } = useSelector((state: any) => state.setting);

    const [incentiveTasks, setIncentiveTasks] = useState<any[]>([]);
    const [progressBarWidth, setProgressBarWidth] = useState(0);

    useEffect(() => {
        if (tasks && tasks.length > 0) {
            const mappedTasks = tasks.map((level: any) => {
                const rideValue = Math.min(completedRides, level.target_rides); // cumulative progress
                return {
                    ...level,
                    rideValue,
                };
            });
            setIncentiveTasks(mappedTasks);
        }
    }, [tasks, completedRides]);


    const getProgress = (rideValue: number, totalRide: number) => {
        return (rideValue / totalRide) * 100;
    };

    const getSvgWidth = (rideValue: number, totalRide: number) => {
        const progressPercentage = getProgress(rideValue, totalRide);
        return (progressBarWidth * progressPercentage) / 100;
    };

    const handleProgressBarLayout = (event: LayoutChangeEvent) => {
        const { width } = event.nativeEvent.layout;
        if (width > 0 && progressBarWidth === 0) {
            setProgressBarWidth(width);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: isDark ? appColors.bgDark : appColors.graybackground }]}>
            <Header title={translateData.incentiveTask} />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {incentiveTasks.map((task) => (
                    <View key={task.id} style={[styles.taskCard, { backgroundColor: isDark ? appColors.darkThemeSub : appColors.white }]}>
                        <Text style={[styles.taskTitle, { color: isDark ? appColors.white : appColors.primaryFont }]}>
                            {translateData.level} {task.level_number} - {translateData.complete} {task.target_rides} {translateData.rideEarn} {task.incentive_amount}
                        </Text>

                        <View style={styles.progressContainer}>
                            <View style={[styles.progressBarBackground, { backgroundColor: isDark ? appColors.darkborder : appColors.border }]} onLayout={handleProgressBarLayout}>
                                {progressBarWidth > 0 && (
                                    <View
                                        style={[
                                            styles.progressBarFill,
                                            { width: `${getProgress(task.rideValue, task.target_rides)}%` },
                                        ]}
                                    >
                                        <ProgressBarSvg width={getSvgWidth(task.rideValue, task.target_rides)} height={10} />
                                    </View>
                                )}
                            </View>
                            <Text style={[styles.progressText, { color: isDark ? appColors.darkText : appColors.secondaryFont }]}>
                                {task.rideValue}/{task.target_rides}
                            </Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

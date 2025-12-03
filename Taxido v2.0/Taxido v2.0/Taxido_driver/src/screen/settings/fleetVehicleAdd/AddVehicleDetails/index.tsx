import { View, ScrollView, Text } from 'react-native'
import React, { useState } from 'react'
import { useValues } from '../../../../utils/context'
import { useTheme } from '@react-navigation/native'
import appColors from '../../../../theme/appColors'
import { Button, Header, Input } from '../../../../commonComponents'
import { TitleView } from '../../../auth/component'
import styles from './styles'
import { useAppNavigation } from '../../../../utils/navigation'
import { RenderVehicleList } from '../../../auth/registration/vehicleRegistration/component'
import { useSelector } from 'react-redux'


type VehicleFormType = {
    vehicleName: string;
    vehicleNumber: string;
    vehicleModel: string;
    vehicleModelYear: string;
    vehicleColor: string;
    selectedVehicleID: number | undefined;
};


export function AddVehicleDetails({ route }: any) {
    const { isDark, viewRtlStyle } = useValues()
    const { vehicleData, type } = route.params || {};
    const { colors } = useTheme()
    const { navigate } = useAppNavigation()
    const [showWarning, setShowWarning] = useState<boolean>(false)
    const [selectedVehicleID, setSelectedVehicleID] = useState<number | undefined>(undefined)
    const [vehicleIndex, setVehicleIndex] = useState<number | null>(null)
    const [formDatas, setFormData] = useState<VehicleFormType>({
        vehicleName: vehicleData?.name || '',
        vehicleNumber: vehicleData?.plate_number || '',
        vehicleModel: vehicleData?.model || '',
        vehicleModelYear: vehicleData?.model_year || '',
        vehicleColor: vehicleData?.color || '',
        selectedVehicleID: selectedVehicleID
    });

    const bars = Array(2).fill(0)

    const gotoNext = () => {
        const isFormValid = Object.values(formDatas).every(
            value => value?.trim() !== '',
        );

        if (!isFormValid) {
            setShowWarning(true);
        } else {
            setShowWarning(false);
            navigate('AddDocument', {
                formDatas: { ...formDatas, selectedVehicleID },
                vehicleData,
                type
            });
        }
    };



    const handleChange = (key: string, value: string) => {
        setFormData(prevData => ({
            ...prevData,
            [key]: value,
        }))
    }


    const handleVehiclePress = (index: number,
        vehicleName: string,
        vehicleId: number
    ) => {
        setSelectedVehicleID(vehicleId)

    }

      const { translateData } = useSelector((state: any) => state.setting)


    return (
        <View style={{ flex: 1 }}>
            <Header title={translateData?.addVehicle} backgroundColor={isDark ? colors.card : appColors.white} />
            <View style={{ backgroundColor: isDark ? colors.card : appColors.white }}>
                <View style={[styles.container, { flexDirection: viewRtlStyle }]}>
                    {bars?.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                index < 1
                                    ? styles.filledBar
                                    : [
                                        styles.emptyBar,
                                        {
                                            backgroundColor: isDark
                                                ? appColors.darkFillBar
                                                : appColors.subPrimary,
                                        },
                                    ],
                            ]}
                        />
                    ))}
                </View>
            </View>
            <ScrollView>
                <View style={styles.space}>
                    <TitleView
                        title={translateData?.vehicletitle}
                        subTitle={translateData?.vehicleSubtitle}
                    />
                </View>
                <View style={styles.accNumber}>
                    <Input
                        title={translateData?.vehicleName}
                        titleShow={true}
                        backgroundColor={
                            isDark ? appColors.darkThemeSub : appColors.white
                        }
                        placeholder={translateData?.enterVehicleNames}
                        keyboardType="default"
                        value={formDatas.vehicleName}
                        onChangeText={text => handleChange('vehicleName', text)}
                        showWarning={showWarning && formDatas.vehicleName === ''}
                        warning={translateData?.vehicleNameerror}
                    />
                </View>
                <View style={styles.accNumber}>
                    <Text style={[styles.title,{color:isDark?appColors.white:appColors.black}]}>{translateData?.selectedVehicleType}</Text>
                    <RenderVehicleList
                        vehicleIndex={vehicleIndex}
                        handleItemPress={handleVehiclePress}
                        selectedCategory={''}
                        serviceId={''}
                        categoryId={''}
                        selectedVehicleID={selectedVehicleID}
                    />
                </View>
                <View style={styles.accNumber}>
                    <Input
                        title={translateData.vehicleNumber}
                        titleShow={true}
                        backgroundColor={
                            isDark ? appColors.darkThemeSub : appColors.white
                        }
                        placeholder={translateData?.entervehicleNumber}
                        keyboardType="default"
                        value={formDatas.vehicleNumber}
                        onChangeText={text => handleChange('vehicleNumber', text)}
                        showWarning={showWarning && formDatas.vehicleNumber === ''}
                        warning={translateData?.vehicleNumbererror3}
                    />
                </View>
                <View style={styles.accNumber}>
                    <Input
                        title={translateData?.vehicleModel}
                        titleShow={true}
                        backgroundColor={
                            isDark ? appColors.darkThemeSub : appColors.white
                        }
                        placeholder={translateData?.entervehicleModel}
                        keyboardType="default"
                        value={formDatas.vehicleModel}
                        onChangeText={text => handleChange('vehicleModel', text)}
                        showWarning={showWarning && formDatas.vehicleModel === ''}
                        warning={translateData?.vehicleModelError}
                    />
                </View>
                <View style={styles.accNumber}>
                    <Input
                        title={translateData?.vehicleModalYear}
                        titleShow={true}
                        backgroundColor={
                            isDark ? appColors.darkThemeSub : appColors.white
                        }
                        placeholder={translateData?.entervehicleModalYear}
                        keyboardType="number-pad"
                        value={formDatas.vehicleModelYear}
                        onChangeText={text => handleChange('vehicleModelYear', text)}
                        showWarning={showWarning && formDatas.vehicleModelYear === ''}
                        warning={translateData?.vehicleModalYearerror}
                    />
                </View>
                <View style={styles.accNumber}>
                    <Input
                        title={translateData?.vehicleColor}
                        titleShow={true}
                        backgroundColor={
                            isDark ? appColors.darkThemeSub : appColors.white
                        }
                        placeholder={translateData?.entervehicleColor}
                        keyboardType="ascii-capable"
                        value={formDatas.vehicleColor}
                        onChangeText={text => handleChange('vehicleColor', text)}
                        showWarning={showWarning && formDatas.vehicleColor === ''}
                        warning={translateData?.vehicleColorerror}
                    />
                </View>
            </ScrollView>
            <View style={styles.btnContainer}>
                <Button title={translateData?.next} backgroundColor={appColors.primary} color={appColors.white} onPress={gotoNext} />
            </View>
        </View>
    )
}


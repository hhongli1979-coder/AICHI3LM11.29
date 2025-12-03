import { View, ScrollView, TouchableOpacity, Text } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useValues } from '../../../../utils/context'
import { useTheme } from '@react-navigation/native'
import appColors from '../../../../theme/appColors'
import { Button, Header, Input } from '../../../../commonComponents'
import { TitleView } from '../../../auth/component'
import styles from './styles'
import { useAppNavigation } from '../../../../utils/navigation'
import { windowWidth, windowHeight } from '../../../../theme/appConstant'
import CountrySelect from 'react-native-country-select'
import type { ICountry as CountryType } from 'react-native-country-select/lib/interface'

// Type alias to avoid conflicts
type Country = CountryType;

import appFonts from '../../../../theme/appFonts'
import DropDownPicker from 'react-native-dropdown-picker'
import { useSelector } from 'react-redux'
import Icons from '../../../../utils/icons/icons'

type DriverFormType = {
    driverName: string
    driverEmail: string
    phoneNumber: string
    driverAddress: string
    selectedVehicleId: string
    selectedServiceId: number
    selectedCategoryId: number
    confirmPassword: string
    password: string
    countryCode: string
}

export function AddDriverDetails({ route }: any) {
    const { isDark, viewRtlStyle, textRtlStyle, rtl } = useValues()
    const { driverData, type } = route.params || {};
    const { colors } = useTheme()
    const { navigate } = useAppNavigation()
    const { serviceData } = useSelector((state: any) => state.service)
    const [showWarning, setShowWarning] = useState<boolean>(false)
    const { translateData } = useSelector((state: any) => state.setting)
    const [openService, setOpenService] = useState(false)
    const [selectedService, setSelectedService] = useState<number | null>(null)
    const [serviceError, setServiceError] = useState('')
    const [openCategory, setOpenCategory] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
    const [categoryError, setCategoryError] = useState('')
    const [categoryList, setCategoryList] = useState<any[]>([])
    const [openVehicle, setOpenVehicle] = useState(false)
    const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null)
    const [vehicleError, setVehicleError] = useState('')
    const [country, setCountry] = useState<Country>({
        name: {
            common: 'India',
            official: 'Republic of India',
            native: {
                eng: {
                    official: 'Republic of India',
                    common: 'India'
                }
            }
        },
        tld: ['.in'],
        cca2: 'IN',
        ccn3: '356',
        cca3: 'IND',
        cioc: 'IND',
        independent: true,
        status: 'officially-assigned',
        unMember: true,
        unRegionalGroup: 'Asia',
        currencies: {
            INR: {
                name: 'Indian Rupee',
                symbol: '₹'
            }
        },
        idd: {
            root: '+91',
            suffixes: []
        },
        capital: ['New Delhi'],
        altSpellings: ['IN', 'Bhārat', 'Republic of India', 'Bharat Ganrajya'],
        region: 'Asia',
        subregion: 'Southern Asia',
        languages: {
            eng: 'English',
            hin: 'Hindi',
            tam: 'Tamil'
        },
        translations: {
            eng: {
                official: 'Republic of India',
                common: 'India'
            }
        },
        latlng: [20, 77],
        landlocked: false,
        borders: ['AFG', 'BGD', 'BTN', 'MMR', 'CHN', 'NPL', 'PAK', 'LKA'],
        area: 3287590,
        flag: '🇮🇳',
        demonyms: {
            eng: {
                f: 'Indian',
                m: 'Indian'
            }
        }
    } as Country)
    const [visible, setVisible] = useState<boolean>(false)
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false)
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState<boolean>(false)
    const { fleetVehicle } = useSelector((state: any) => state.fleet)

    const [error, setError] = useState<any>({
        password: '',
        confirmPassword: '',
    })
    const [formDatas, setFormData] = useState<DriverFormType>({
        driverName: '',
        driverEmail: '',
        phoneNumber: '',
        driverAddress: '',
        confirmPassword: '',
        password: '',
        selectedServiceId: selectedService || 0,
        selectedCategoryId: selectedCategory || 0,
        selectedVehicleId: selectedVehicle || '',
        countryCode: country.idd?.root?.replace('+', '') || '91',
    })

    useEffect(() => {
        if (type === "edit" && driverData) {
            setFormData((prev) => ({
                ...prev,
                driverName: driverData.name || "",
                driverEmail: driverData.email || "",
                phoneNumber: driverData.phone?.toString() || "",
                driverAddress: driverData.address || "",
                countryCode: driverData.country_code || "91",

            }));

            setSelectedService(driverData?.service_id || null);
            setSelectedCategory(driverData?.service_category_id || null);
            setSelectedVehicle(driverData.vehicle_id?.toString() || null);

            setCountry((prev) => ({
                ...prev,
                callingCode: [driverData.country_code || "91"],
            }));
        }
    }, [type, driverData]);

    // Map services for dropdown
    const serviceList = serviceData?.data?.map((service: any) => ({
        label: service.name,
        value: service.id,
    })) || []

    const handleCountrySelect = (selectedCountry: Country) => {
        setCountry(selectedCountry)
        setFormData(prev => ({
            ...prev,
            countryCode: selectedCountry.idd?.root?.replace('+', '') || '',
        }))
        setVisible(false)
    }

    // Map vehicle types (example static)
    const mappedFleetVehicle =
        fleetVehicle?.data?.map((v: any) => ({
            label: v.name,
            value: v.id,
        })) || []


    // Update category list whenever a service is selected
    useEffect(() => {
        if (selectedService) {
            const service = serviceData?.data?.find((s: any) => s.id === selectedService)
            if (service?.service_categories) {
                setCategoryList(
                    service.service_categories.map((cat: any) => ({
                        label: cat.name,
                        value: cat.id,
                    }))
                )
            } else {
                setCategoryList([])
            }
            setSelectedCategory(null) // Reset selected category when service changes
        } else {
            setCategoryList([])
            setSelectedCategory(null)
        }
    }, [selectedService, serviceData])

    const bars = Array(2).fill(0)
    const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    const gotoNext = () => {
        let isFormValid = true;
        setServiceError('');
        setCategoryError('');
        setVehicleError('');
        setError({ password: '', confirmPassword: '' });

        if (!formDatas.driverName.trim()) isFormValid = false;
        if (!formDatas.driverEmail.trim() || !isValidEmail(formDatas.driverEmail)) isFormValid = false;
        if (!formDatas.phoneNumber.trim()) isFormValid = false;

        //  Only validate password in Add mode
        if (type === "add") {
            if (!formDatas.password.trim()) {
                isFormValid = false;
                setError((prev: any) => ({ ...prev, password: translateData.password }));
            } else if (formDatas.password.length < 8) {
                isFormValid = false;
                setError((prev: any) => ({ ...prev, password: translateData.passwordMinLength }));
            }

            if (!formDatas.confirmPassword.trim()) {
                isFormValid = false;
                setError((prev: any) => ({ ...prev, confirmPassword: translateData.confirmPassword }));
            } else if (formDatas.confirmPassword !== formDatas.password) {
                isFormValid = false;
                setError((prev: any) => ({ ...prev, confirmPassword: translateData?.passwordnomatch }));
            }
        }

        if (!selectedService) {
            isFormValid = false;
            setServiceError(translateData?.pleaseSerivce);
        }
        if (!selectedCategory) {
            isFormValid = false;
            setCategoryError(translateData?.pleasecategory);
        }
        if (!selectedVehicle) {
            isFormValid = false;
            setVehicleError(translateData?.pleaseVehicle);
        }

        if (!isFormValid) {
            setShowWarning(true);
        } else {
            setShowWarning(false);
            navigate('AddDriverDocument', {
                formDatas,
                selectedService,
                selectedCategory,
                selectedVehicle,
                driverData,
                type
            });
        }
    };

    const handleChange = (key: keyof DriverFormType, value: string) => {
        setFormData(prevData => ({ ...prevData, [key]: value }))
    }

    return (
        <View style={{ flex: 1 }}>
            <Header title={translateData?.addDriver} backgroundColor={isDark ? colors.card : appColors.white} />
            <View style={{ backgroundColor: isDark ? colors.card : appColors.white }}>
                <View style={[styles.container, { flexDirection: viewRtlStyle }]}>
                    {bars.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                index < 1
                                    ? styles.filledBar
                                    : [
                                        styles.emptyBar,
                                        { backgroundColor: isDark ? appColors.darkFillBar : appColors.subPrimary },
                                    ],
                            ]}
                        />
                    ))}
                </View>
            </View>
            <ScrollView>
                <View style={styles.space}>
                    <TitleView title={translateData?.AddDriverDetails} subTitle={translateData?.AddDriverregistration} />
                </View>

                {/* Driver Name */}
                <View style={styles.accNumber}>
                    <Input
                        title={translateData?.driverName}
                        titleShow={true}
                        backgroundColor={isDark ? appColors.darkThemeSub : appColors.white}
                        placeholder={translateData?.driverName}
                        value={formDatas.driverName}
                        onChangeText={text => handleChange('driverName', text)}
                        showWarning={showWarning && formDatas.driverName === ''}
                        warning={translateData?.driverName}
                    />
                </View>

                {/* Driver Email */}
                <View style={styles.accNumber}>
                    <Input
                        title={translateData?.driverName}
                        titleShow={true}
                        backgroundColor={isDark ? appColors.darkThemeSub : appColors.white}
                        placeholder={translateData?.enterDriverEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={formDatas.driverEmail}
                        onChangeText={text => handleChange('driverEmail', text)}
                        showWarning={showWarning && (!formDatas.driverEmail || !isValidEmail(formDatas.driverEmail))}
                        warning={translateData?.driverEmailWarn}
                    />
                </View>

                {/* Driver Phone */}
                <Text
                    style={{
                        color: isDark ? appColors.white : appColors.primaryFont,
                        fontFamily: appFonts.medium,
                        textAlign: textRtlStyle,
                        marginHorizontal: windowWidth(4),
                    }}
                >
                    {translateData?.driver}{translateData?.mobileNumber}
                </Text>
                <View
                    style={[
                        styles.countryCodeContainer,
                        {
                            flexDirection: viewRtlStyle,
                            alignSelf: 'center',
                            width: '91%',
                            alignItems: 'center',
                        },
                    ]}
                >
                    <View style={[styles.codeComponent, { marginRight: windowWidth(2) }]}>
                        <TouchableOpacity
                            style={[
                                styles.countryCode,
                                {
                                    backgroundColor: isDark ? appColors.darkThemeSub : appColors.white,
                                    borderColor: colors.border,
                                    marginBottom: showWarning && !formDatas.phoneNumber.trim() ? 24 : windowHeight(0.8),
                                },
                            ]}
                            onPress={() => setVisible(true)}
                        >
                            {country.idd?.root && (
                                <Text
                                    style={[
                                        styles.codeText,
                                        { color: isDark ? appColors.white : appColors.black },
                                    ]}
                                >
                                    {country.idd.root}
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                    <Input
                        backgroundColor={isDark ? appColors.darkThemeSub : appColors.white}
                        placeholder={translateData?.driverMobile}
                        keyboardType='number-pad'
                        value={formDatas.phoneNumber}
                        onChangeText={text => handleChange('phoneNumber', text)}
                        showWarning={
                            showWarning &&
                            (!formDatas.phoneNumber.trim() ||
                                (!/^[0-9]+$/.test(formDatas.phoneNumber) &&
                                    !isValidEmail(formDatas.phoneNumber)))
                        }
                        warning={'Enter valid phone number or email'}
                        style={[styles.input, { width: '70%' }]}
                    />
                </View>

                {type != 'edit' && (
                    <>
                        <View style={styles.accNumber}>
                            <Input
                                title={translateData.createaccount}
                                titleShow={true}
                                placeholder={translateData.password}
                                value={formDatas.password}
                                warning={
                                    showWarning && formDatas.password === ''
                                        ? translateData.password
                                        : formDatas.password.length > 0 && formDatas.password.length < 8
                                            ? translateData.passwordMinLength
                                            : ''
                                }
                                onChangeText={text => handleChange('password', text)}
                                showWarning={
                                    showWarning &&
                                    (formDatas.password === '' || formDatas.password.length < 8)
                                }
                                backgroundColor={isDark ? appColors.darkThemeSub : appColors.white}
                                borderColor={colors.border}
                                rightIcon={
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                                    >
                                        {isPasswordVisible ? <Icons.EyeOpen /> : <Icons.EyeClose />}
                                    </TouchableOpacity>
                                }
                                secureText={!isPasswordVisible}
                                style={rtl ? styles.view : null}
                            />
                        </View>

                        <View style={styles.accNumber}>
                            <Input
                                title={translateData.cPw}
                                titleShow={true}
                                placeholder={translateData.confirmPassword}
                                value={formDatas.confirmPassword}
                                onChangeText={text => handleChange('confirmPassword', text)}
                                showWarning={!!error.confirmPassword}
                                warning={error.confirmPassword}
                                backgroundColor={isDark ? appColors.darkThemeSub : appColors.white}
                                borderColor={colors.border}
                                rightIcon={
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                                    >
                                        {isConfirmPasswordVisible ? <Icons.EyeOpen /> : <Icons.EyeClose />}
                                    </TouchableOpacity>
                                }
                                secureText={!isConfirmPasswordVisible}
                                style={rtl ? styles.view : null}
                            />
                        </View>
                    </>
                )}

                {/* Service Dropdown */}
                <View style={styles.accNumber}>
                    <Text
                        style={{
                            color: isDark ? appColors.white : appColors.primaryFont,
                            fontFamily: appFonts.medium,
                            marginBottom: windowHeight(1),
                        }}
                    >
                       {translateData?.selectService}
                    </Text>
                    <DropDownPicker
                        open={openService}
                        value={selectedService}
                        items={serviceList}
                        setOpen={setOpenService}
                        setValue={callback => {
                            const value = callback(selectedService)
                            setSelectedService(value)
                            setFormData(prev => ({ ...prev, selectedServiceId: value }))
                            if (value) setServiceError('')
                        }}
                        placeholder={translateData?.selectService}
                        placeholderStyle={{
                            color: isDark ? appColors.darkText : appColors.secondaryFont,
                        }}
                        dropDownContainerStyle={{
                            backgroundColor: isDark ? colors.card : appColors.white,
                            borderColor: colors.border,
                        }}
                        textStyle={{ color: colors.text, textAlign: rtl ? 'right' : 'left' }}
                        style={{
                            borderColor: isDark ? appColors.darkborder : appColors.border,
                            backgroundColor: isDark ? appColors.darkThemeSub : appColors.white,
                            flexDirection: viewRtlStyle,
                        }}
                        zIndex={3}
                        listMode="SCROLLVIEW"
                        dropDownDirection="AUTO"
                          ArrowDownIconComponent={({ style }) => (
                            <View style={[{ transform: [{ rotate: '-90deg' }] }]}>
                                <Icons.Back color={colors.text} />
                            </View>
                        )}
                        ArrowUpIconComponent={({ style }) => (
                            <View style={[{ transform: [{ rotate: '90deg' }] }]}>

                                <Icons.Back color={colors.text} />
                            </View>
                        )}
                    />
                    {serviceError ? <Text style={styles.errorText}>{serviceError}</Text> : null}
                </View>

                <View style={styles.accNumber}>
                    <Text
                        style={{
                            color: isDark ? appColors.white : appColors.primaryFont,
                            fontFamily: appFonts.medium,
                            marginBottom: windowHeight(1),
                            marginTop: windowHeight(1.5),
                        }}
                    >
                        {translateData?.selectcategory}
                    </Text>
                    <DropDownPicker
                        open={openCategory}
                        value={selectedCategory}
                        items={categoryList}
                        setOpen={setOpenCategory}
                        setValue={callback => {
                            const value = callback(selectedCategory)
                            setSelectedCategory(value)
                            setFormData(prev => ({ ...prev, selectedCategoryId: value }))
                            if (value) setCategoryError('')
                        }}
                        placeholder={translateData?.SelectCategory}
                        placeholderStyle={{
                            color: isDark ? appColors.darkText : appColors.secondaryFont,
                        }}
                        dropDownContainerStyle={{
                            backgroundColor: isDark ? colors.card : appColors.white,
                            borderColor: colors.border,
                        }}
                        textStyle={{ color: colors.text, textAlign: rtl ? 'right' : 'left' }}
                        style={{
                            borderColor: isDark ? appColors.darkborder : appColors.border,
                            backgroundColor: isDark ? appColors.darkThemeSub : appColors.white,
                            flexDirection: viewRtlStyle,
                        }}
                        zIndex={2}
                        listMode="SCROLLVIEW"
                        dropDownDirection="AUTO"
                          ArrowDownIconComponent={({ style }) => (
                            <View style={[{ transform: [{ rotate: '-90deg' }] }]}>
                                <Icons.Back color={colors.text} />
                            </View>
                        )}
                        ArrowUpIconComponent={({ style }) => (
                            <View style={[{ transform: [{ rotate: '90deg' }] }]}>

                                <Icons.Back color={colors.text} />
                            </View>
                        )}
                    />
                    {categoryError ? <Text style={styles.errorText}>{categoryError}</Text> : null}
                    
                </View>

                {/* Vehicle Dropdown */}
                <View style={styles.accNumber}>
                    <Text
                        style={{
                            color: isDark ? appColors.white : appColors.primaryFont,
                            fontFamily: appFonts.medium,
                            marginBottom: windowHeight(1),
                            marginTop: windowHeight(1.5),
                        }}
                    >
                        {translateData?.selectVehicel}
                    </Text>
                    <DropDownPicker
                        open={openVehicle}
                        value={selectedVehicle}
                        items={mappedFleetVehicle}
                        setOpen={setOpenVehicle}
                        setValue={callback => {
                            const value = callback(selectedVehicle)
                            setSelectedVehicle(value)
                            setFormData(prev => ({ ...prev, selectedVehicleId: value }))
                            if (value) setVehicleError('')
                        }}
                        placeholder={translateData?.selectVehicle}
                        placeholderStyle={{
                            color: isDark ? appColors.darkText : appColors.secondaryFont,
                        }}
                        dropDownContainerStyle={{
                            backgroundColor: isDark ? colors.card : appColors.white,
                            borderColor: colors.border,
                        }}
                        textStyle={{ color: colors.text, textAlign: rtl ? 'right' : 'left' }}
                        style={{
                            borderColor: isDark ? appColors.darkborder : appColors.border,
                            backgroundColor: isDark ? appColors.darkThemeSub : appColors.white,
                            flexDirection: viewRtlStyle,
                        }}
                        zIndex={1}
                        listMode="SCROLLVIEW"
                        dropDownDirection="AUTO"
                          ArrowDownIconComponent={({ style }) => (
                            <View style={[{ transform: [{ rotate: '-90deg' }] }]}>
                                <Icons.Back color={colors.text} />
                            </View>
                        )}
                        ArrowUpIconComponent={({ style }) => (
                            <View style={[{ transform: [{ rotate: '90deg' }] }]}>

                                <Icons.Back color={colors.text} />
                            </View>
                        )}
                    />
                    {vehicleError ? <Text style={styles.errorText}>{vehicleError}</Text> : null}
                </View>
            </ScrollView>

            <View style={styles.btnContainer}>
                <Button title={translateData?.next}backgroundColor={appColors.primary} color={appColors.white} onPress={gotoNext} />
            </View>

            <CountrySelect
                visible={visible}
                onClose={() => setVisible(false)}
                onSelect={handleCountrySelect}
                showSearchInput={true}
                showCloseButton={true}
                showAlphabetFilter={true}
            />
        </View>
    )
}
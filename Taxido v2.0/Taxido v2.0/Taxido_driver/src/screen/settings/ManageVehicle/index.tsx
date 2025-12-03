import React, { useEffect, useMemo, useCallback, memo, useRef, useState } from "react";
import { BackHandler, Image, FlatList, Text, TouchableOpacity, View, StyleSheet, RefreshControl } from "react-native";
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
import Icons from "../../../utils/icons/icons";
import appColors from "../../../theme/appColors";
import { fontSizes, windowHeight, windowWidth } from "../../../theme/appConstant";
import { BackButton, notificationHelper } from "../../../commonComponents";
import appFonts from "../../../theme/appFonts";
import styles from "./styles";
import { useAppNavigation } from "../../../utils/navigation";
import { useValues } from "../../../utils/context";
import { useDispatch, useSelector } from "react-redux";
import { DELETE_API } from "../../../api/methods";
import { fleetVehicle as fleetVehicleEndpoint } from "../../../api/endpoints/fleetEndpoint";
import { fleetVehicleList } from "../../../api/store/action";
import { useNavigation } from "@react-navigation/native";


type VehicleCardType = {
    name: string;
    email: string;
    status: string;
    statusColor: string;
    bgColor: string;
    isDark: boolean;
    rtl?: boolean;
    driverId: number;
    vehicleData: any;
    onDelete: (id: number) => void;
    onEdit: (data: any) => void;
};

const VehicleCard = memo(({ name, email, status, statusColor, bgColor, isDark, rtl, driverId, vehicleData, onDelete, onEdit }: VehicleCardType) => {

    const cardContainerStyle = useMemo(() => ({
        backgroundColor: isDark ? appColors.bgDark : appColors.white,
        borderWidth: windowHeight(0.1),
        borderColor: isDark ? appColors.darkborder : appColors.border,
        width: "90%" as const,
        height: windowHeight(16.5),
        marginTop: windowHeight(3),
        alignSelf: "center" as const,
        borderRadius: windowHeight(0.9),
    }), [isDark]);

    const headerRowStyle = useMemo(() => ({
        flexDirection: rtl ? "row-reverse" as const : "row" as const,
        marginTop: windowHeight(2),
        marginHorizontal: windowHeight(2),
    }), [rtl]);

    const imageContainerStyle = useMemo(() => ({
        height: windowHeight(6),
        width: windowHeight(6),
        alignItems: "center" as const,
        justifyContent: "center" as const,
        borderRadius: windowHeight(0.5),
        backgroundColor: appColors.lightGray
    }), []);

    const vehicleImageStyle = useMemo(() => ({
        height: windowHeight(4.8),
        width: windowHeight(4.8),
    }), []);

    const infoContainerStyle = useMemo(() => ({
        justifyContent: "space-around" as const,
        flex: 1,
        marginHorizontal: windowHeight(1),
        paddingVertical: windowHeight(0.5),
    }), []);

    const nameRowStyle = useMemo(() => ({
        flexDirection: rtl ? "row-reverse" as const : "row" as const,
        alignItems: "center" as const,
        justifyContent: "space-between" as const,
    }), [rtl]);

    const nameTextStyle = useMemo(() => ({
        color: isDark ? appColors.white : appColors.black,
        fontFamily: appFonts.bold,
        fontSize: fontSizes.FONT3HALF,
        textAlign: rtl ? "left" as const : "right" as const,
    }), [isDark, rtl]);

    const plateRowStyle = useMemo(() => ({
        flexDirection: rtl ? "row-reverse" as const : "row" as const,
        alignItems: "center" as const,
    }), [rtl]);

    const plateTextStyle = useMemo(() => ({
        color: appColors.primary,
        fontFamily: appFonts.bold,
        fontSize: fontSizes.FONT3HALF,
    }), []);

    const dividerStyle = useMemo(() => ({
        borderBottomWidth: windowHeight(0.1),
        borderColor: isDark ? appColors.darkborder : appColors.border,
        width: "90%" as const,
        alignSelf: "center" as const,
        marginVertical: windowHeight(1),
    }), [isDark]);

    const footerRowStyle = useMemo(() => ({
        flexDirection: rtl ? "row-reverse" as const : "row" as const,
        justifyContent: "space-between" as const,
        marginHorizontal: windowWidth(4),
        marginVertical: windowHeight(1.5),
    }), [rtl]);

    const statusBadgeStyle = useMemo(() => ({
        backgroundColor: bgColor,
        paddingVertical: windowHeight(0.5),
        borderRadius: windowHeight(0.5),
        paddingHorizontal: windowHeight(2),
        height: windowHeight(5),
        width: '100%' as const,
        alignItems: "center" as const,
        justifyContent: "center" as const
    }), [bgColor]);

    const statusTextStyle = useMemo(() => ({
        color: statusColor,
        fontFamily: appFonts.medium,
        fontSize: fontSizes.FONT4,
    }), [statusColor]);

    const actionsRowStyle = useMemo(() => ({
        alignItems: "flex-end" as const,
        flexDirection: rtl ? "row-reverse" as const : "row" as const,
        justifyContent: "space-between" as const,
        gap: 10,
        alignSelf: "center" as const,
    }), [rtl]);

    const separatorStyle = useMemo(() => ({
        height: windowHeight(2),
        borderColor: isDark ? appColors.darkborder : appColors.border,
        borderWidth: windowHeight(0.1),
    }), [isDark]);

    const handleDelete = useCallback(() => {
        onDelete(driverId);
    }, [driverId, onDelete]);

    const handleEdit = useCallback(() => {
        onEdit(vehicleData);
    }, [vehicleData, onEdit]);

    return (
        <View style={cardContainerStyle}>
            <View style={headerRowStyle}>
                <View style={imageContainerStyle}>
                    <Image
                        source={{ uri: vehicleData?.vehicle_type_image_url }}
                        resizeMode="contain"
                        style={vehicleImageStyle}
                    />
                </View>

                <View style={infoContainerStyle}>
                    <View style={nameRowStyle}>
                        <Text style={nameTextStyle}>
                            {name}
                        </Text>
                    </View>

                    <View style={plateRowStyle}>
                        <Text style={plateTextStyle}>
                            {vehicleData?.plate_number}
                        </Text>
                    </View>
                </View>
                <View>
                    <View style={actionsRowStyle}>
                        <TouchableOpacity onPress={handleEdit}>
                            <Icons.edit color="#60A5FA" />
                        </TouchableOpacity>
                        <View style={separatorStyle} />
                        <TouchableOpacity onPress={handleDelete}>
                            <Icons.Delete />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View style={footerRowStyle}>
                <View style={statusBadgeStyle}>
                    <Text style={statusTextStyle}>
                        {status}
                    </Text>
                </View>
            </View>
        </View>
    );
});

export function ManageVehicle() {
    const dispatch = useDispatch();
    const { navigate } = useAppNavigation();
    const { isDark, rtl } = useValues();
    const navigation = useNavigation<any>();
    const { fleetVehicle } = useSelector((state: any) => state.fleet)
    const deleteBottomSheetRef = useRef<BottomSheetModal>(null);
    const [vehicleToDelete, setVehicleToDelete] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        const backAction = () => {
            navigation.navigate('TabNav');
            return true;
        };
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );
        return () => backHandler.remove();
    }, [navigation]);

    const gotoAddVehicle = useCallback(() => {
        navigate("AddVehicleDetails");
    }, [navigate]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await dispatch(fleetVehicleList() as any);
        } catch (error) {
            console.error('Error refreshing vehicle list:', error);
        } finally {
            setRefreshing(false);
        }
    }, [dispatch]);

    const handleDeleteVehicle = useCallback((id: number) => {
        setVehicleToDelete(id);
        deleteBottomSheetRef.current?.present();
    }, []);

    const confirmDelete = useCallback(async () => {
        if (!vehicleToDelete) return;
        setIsDeleting(true);
        try {
            const res = await DELETE_API(`${fleetVehicleEndpoint}/${vehicleToDelete}`);
            if (res?.status === 200) {
                notificationHelper('', translateData?.vehicleupdateDelte, 'success');
                dispatch(fleetVehicleList() as any);
                deleteBottomSheetRef.current?.dismiss();
            } else {
                notificationHelper('', translateData?.failedvehicle, 'error');
            }
        } catch (e) {
            console.error('Delete error:', e);
            notificationHelper('', translateData?.failedvehicle, 'error');
        } finally {
            setIsDeleting(false);
            setVehicleToDelete(null);
        }
    }, [vehicleToDelete, dispatch]);

    const cancelDelete = useCallback(() => {
        deleteBottomSheetRef.current?.dismiss();
        setVehicleToDelete(null);
    }, []);

    const handleEditVehicle = useCallback((vehicleData: any) => {
        navigate('AddVehicleDetails', { vehicleData, type: 'edit' } as any);
    }, [navigate]);

    const getStatusStyle = useCallback((status: string) => {
        const normalizedStatus = status?.toLowerCase();

        if (normalizedStatus == 'approved') {
            return {
                displayText: 'Approved',
                bgColor: appColors.primaryBg,
                textColor: appColors.primary
            };
        } else if (normalizedStatus == 'pending') {
            return {
                displayText: 'Pending',
                bgColor: appColors.lightYellow,
                textColor: appColors.yellow
            };
        }
        return {
            displayText: status?.charAt(0).toUpperCase() + status?.slice(1).toLowerCase() || '',
            bgColor: appColors.graybackground,
            textColor: appColors.secondaryFont
        };
    }, []);

    const headerStyle = useMemo(() => ([
        styles.header,
        {
            backgroundColor: isDark ? appColors.bgDark : appColors.white,
            flexDirection: rtl ? "row-reverse" as const : "row" as const,
            borderColor: isDark ? appColors.darkborder : appColors.border,
        },
    ]), [isDark, rtl]);

    const addButtonStyle = useMemo(() => ({
        height: windowHeight(4.7),
        width: windowHeight(4.7),
        borderWidth: 1,
        borderRadius: windowHeight(0.9),
        borderColor: isDark ? appColors.darkborder : appColors.border,
        alignItems: "center" as const,
        backgroundColor: isDark ? appColors.bgDark : appColors.white,
        justifyContent: "center" as const,
    }), [isDark]);

    const titleStyle = useMemo(() => ([
        styles.activeRide,
        { color: isDark ? appColors.white : appColors.primaryFont },
    ]), [isDark]);

    const renderVehicleCard = useCallback(({ item }: { item: any }) => {
        const statusStyle = getStatusStyle(item.status);

        return (
            <VehicleCard
                key={item.id}
                name={item.name}
                email={item.email}
                status={statusStyle.displayText}
                statusColor={statusStyle.textColor}
                bgColor={statusStyle.bgColor}
                driverId={item.id}
                isDark={isDark}
                rtl={rtl}
                vehicleData={item}
                onDelete={handleDeleteVehicle}
                onEdit={handleEditVehicle}
            />
        );
    }, [isDark, rtl, handleDeleteVehicle, handleEditVehicle, getStatusStyle]);

    const keyExtractor = useCallback((item: any) => item.id.toString(), []);

    const vehicles = useMemo(() => fleetVehicle?.data || [], [fleetVehicle?.data]);
    const { translateData } = useSelector((state: any) => state.setting)

    return (
        <BottomSheetModalProvider>
            <View style={{ flex: 1 }}>
                <View style={headerStyle}>
                    <BackButton />
                    <View style={styles.headerTitle}>
                        <Text style={titleStyle}>
                            {translateData?.manageVehicle}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={addButtonStyle}
                        onPress={gotoAddVehicle}
                    >
                        <Icons.plus color={isDark ? appColors.white : appColors.black} />
                    </TouchableOpacity>
                </View>

                {vehicles.length > 0 ? (
                    <FlatList
                        data={vehicles}
                        renderItem={renderVehicleCard}
                        keyExtractor={keyExtractor}
                        initialNumToRender={10}
                        maxToRenderPerBatch={10}
                        windowSize={5}
                        removeClippedSubviews={true}
                        contentContainerStyle={{ paddingBottom: windowHeight(2) }}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                tintColor={isDark ? appColors.white : appColors.black}
                                colors={[appColors.primary]}
                                progressBackgroundColor={isDark ? appColors.bgDark : appColors.white}
                            />
                        }
                    />
                ) : (
                    <View style={{ alignItems: 'center', marginTop: windowHeight(14) }}>
                        <Image source={require('../../../assets/images/noVehicle.png')} style={{ height: windowHeight(40), width: windowHeight(40), resizeMode: 'contain' }} />
                        <Text style={{
                            color: isDark ? appColors.white : appColors.black,
                            fontFamily: appFonts.medium,
                            fontSize: fontSizes.FONT4HALF,
                            marginTop: windowHeight(2)
                        }}>
                            {translateData?.notfound}
                        </Text>
                        <Text style={{
                            textAlign: 'center',
                            fontFamily: appFonts.regular,
                            marginTop: windowHeight(1),
                            color: isDark ? appColors.darkText : appColors.secondaryFont,
                            paddingHorizontal: windowWidth(8)
                        }}>
                            {translateData?.novehicleNote}
                        </Text>
                    </View>
                )}

                <BottomSheetModal
                    ref={deleteBottomSheetRef}
                    index={0}
                    snapPoints={['28%']}
                    handleIndicatorStyle={{
                        backgroundColor: appColors.primary,
                        width: '13%',
                    }}
                    backgroundStyle={{
                        backgroundColor: isDark ? appColors.bgDark : appColors.white,
                    }}
                >
                    <BottomSheetView style={{ padding: windowHeight(2), paddingHorizontal: windowWidth(5) }}>
                        <Text
                            style={{
                                color: isDark ? appColors.white : appColors.primaryFont,
                                fontFamily: appFonts.medium,
                                fontSize: fontSizes.FONT4HALF,
                                marginBottom: windowHeight(1),
                            }}
                        >
                            {translateData?.deleteVehicle}
                        </Text>
                        <Text
                            style={{
                                color: appColors.secondaryFont,
                                fontFamily: appFonts.regular,
                                fontSize: fontSizes.FONT3HALF,
                                marginBottom: windowHeight(3),
                            }}
                        >
                            {translateData?.vehiclenote}
                        </Text>

                        <View
                            style={{
                                flexDirection: rtl ? 'row-reverse' : 'row',
                                justifyContent: 'space-between',
                                gap: windowWidth(3),
                            }}
                        >
                            <TouchableOpacity
                                onPress={cancelDelete}
                                style={{
                                    flex: 1,
                                    height: windowHeight(6),
                                    borderRadius: windowHeight(1),
                                    borderWidth: 1,
                                    borderColor: isDark ? appColors.darkborder : appColors.border,
                                    backgroundColor: isDark ? appColors.bgDark : appColors.white,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Text
                                    style={{
                                        color: isDark ? appColors.white : appColors.primaryFont,
                                        fontFamily: appFonts.medium,
                                        fontSize: fontSizes.FONT4,
                                    }}
                                >
                                    {translateData?.cancel}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={confirmDelete}
                                disabled={isDeleting}
                                style={{
                                    flex: 1,
                                    height: windowHeight(6),
                                    borderRadius: windowHeight(1),
                                    backgroundColor: appColors.red,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    opacity: isDeleting ? 0.6 : 1,
                                }}
                            >
                                <Text
                                    style={{
                                        color: appColors.white,
                                        fontFamily: appFonts.medium,
                                        fontSize: fontSizes.FONT4,
                                    }}
                                >
                                    {isDeleting ? translateData?.deleteing : translateData?.confirm}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </BottomSheetView>
                </BottomSheetModal>
            </View>
        </BottomSheetModalProvider>
    );
}

import { StyleSheet } from 'react-native'
import { windowHeight, windowWidth } from '../../../../theme/appConstant'

const styles = StyleSheet.create({
    map: {
        flex: 1,
    },
    vehicle_map_icon: {
        width: 40,
        height: 40,
        resizeMode: 'contain'
    },
    extraSection: {
        
        borderTopEndRadius:windowWidth(5),
        borderStartStartRadius:windowWidth(5),
        position:'absolute',
        bottom:windowHeight(0),
        height: windowHeight(32),
    },
    greenSection: {
        top: windowHeight(2),
        width: '100%',
        height: windowHeight(22),
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    additionalSection: {
        marginVertical: windowHeight(2),
        alignItems: 'center',
        height: windowHeight(16.5),
        marginHorizontal: windowWidth(4),
        borderRadius: 5,
        borderWidth: windowHeight(0.1),
    },
    backButton: {
        position: 'absolute',
        marginHorizontal: windowWidth(3),
        top: windowHeight(0.5),
    },
})

export default styles

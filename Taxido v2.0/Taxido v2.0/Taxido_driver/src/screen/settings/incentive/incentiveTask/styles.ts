import { StyleSheet } from 'react-native'
import appColors from '../../../../theme/appColors'
import { windowHeight, windowWidth, fontSizes } from '../../../../theme/appConstant'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: appColors.graybackground,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: windowWidth(4),
        paddingBottom: windowHeight(4),
    },
    taskCard: {
        backgroundColor: appColors.white,
        borderRadius: windowHeight(1.5),
        padding: windowWidth(4),
        marginBottom: windowHeight(2),
    },
    taskTitle: {
        fontSize: fontSizes.FONT4,
        color: appColors.primaryFont,
        marginBottom: windowHeight(1.5),
        lineHeight: windowHeight(3),
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: windowWidth(3),
    },
    progressBarBackground: {
        flex: 1,
        height: windowHeight(1.2),
        backgroundColor: appColors.border,
        borderRadius: windowHeight(5),
        overflow: 'hidden',
        justifyContent: 'center',
    },
    progressBarFill: {
        height: windowHeight(1.2),
        borderRadius: windowHeight(5),
        overflow: 'hidden',
    },
    progressText: {
        fontSize: fontSizes.FONT3HALF,
        color: appColors.secondaryFont,
        fontWeight: '500',
        minWidth: windowWidth(9),
        textAlign: 'right',
    },
})

export default styles
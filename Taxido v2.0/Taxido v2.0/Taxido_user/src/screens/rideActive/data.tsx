import { CancelAnswer, CancelCloser, CancelComplaint, CancelAsk, CancelExtra, CancelOffline, CancelWait } from '@utils/icons'

const cancelReason = [
    { id: 1, text: 'driverDetails.reason1', icon: <CancelExtra /> },
    { id: 2, text: 'driverDetails.reason2', icon: <CancelAsk /> },
    { id: 3, text: 'driverDetails.reason3', icon: <CancelOffline /> },
    { id: 4, text: 'driverDetails.reason4', icon: <CancelWait /> },
    { id: 5, text: 'driverDetails.reason5', icon: <CancelAnswer /> },
    { id: 6, text: 'driverDetails.reason6', icon: <CancelComplaint /> },
    { id: 7, text: 'driverDetails.reason7', icon: <CancelCloser /> },
];

export default cancelReason
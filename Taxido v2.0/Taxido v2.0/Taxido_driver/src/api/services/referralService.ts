import { referralBonus } from "../endpoints/referralEndPoint";
import { GET_API } from "../methods";

export const referralData = async () => {
    return GET_API(referralBonus)
        .then((res) => {
            return res;
        })
        .catch((e) => {
            return e?.response;
        });
};

const paymentServices = {
    referralData,
};
export default paymentServices;

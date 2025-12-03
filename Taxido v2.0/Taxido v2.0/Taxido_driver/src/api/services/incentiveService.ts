import { incentive } from "../endpoints/incentiveEndPoint";
import { GET_API } from "../methods";

export const incentivesValue = async ({ incentivedate }: { incentivedate: string }) => {
    return GET_API(`${incentive}?date=${incentivedate}`)
        .then((res) => {
            return res;
        })
        .catch((e) => {
            return e?.response;
        });
};

const incentiveService = {
    incentivesValue,
};

export default incentiveService;

import { REFERRAL } from "../types/index";
import { referralService } from "../../services/index";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const referralData = createAsyncThunk(REFERRAL, async () => {
    const response = await referralService.referralData();
    return {
        data: response.data,
        status: response.status,
    };
});


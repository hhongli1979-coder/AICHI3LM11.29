import { PAYMENT, VERIFY_PAYMENT } from "../types/index";
import { paymentServices } from "../../services/index";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { PaymentVerifyInterface } from "@src/api/interface/paymentInterface";

export const paymentsData = createAsyncThunk(PAYMENT, async () => {
  const response = await paymentServices.paymentData();  
  return {
    data: response.data,
    status: response.status,
  };
});


export const paymentVerify = createAsyncThunk(
  VERIFY_PAYMENT,
  async (data: PaymentVerifyInterface) => {
    const response = await paymentServices.paymentVerify(data);
    return response?.data;
  }
);

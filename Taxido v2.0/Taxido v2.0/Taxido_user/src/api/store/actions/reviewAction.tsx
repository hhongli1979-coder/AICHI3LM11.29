import { DRIVER_REVIEW } from "../types/index";
import { driverReviewServices } from "../../services/index";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { DriverReviewDataInterface } from "../../interface/reviewInterface";

export const driverReviewPost = createAsyncThunk(
  DRIVER_REVIEW,
  async (data: DriverReviewDataInterface) => {
    const response = await driverReviewServices.driverReviewPost(data);
    return response?.data;
  }
);

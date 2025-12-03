import { SERVICECATEGORY } from "../types/index";
import { categoryServices } from "../../services/index";
import { createAsyncThunk } from '@reduxjs/toolkit';


export const categoryDataGet = createAsyncThunk(SERVICECATEGORY, async () => {
  const response = await categoryServices.categoryDataGet();
  return response?.data;
},
);

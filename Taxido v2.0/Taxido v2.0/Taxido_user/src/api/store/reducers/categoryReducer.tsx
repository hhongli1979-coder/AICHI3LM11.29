import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { categoryDataGet } from '../actions/categoryAction';
import { CategoryInterface } from '../../interface/categoryInterface';


const initialState: CategoryInterface = {
    categoryData: [],
    loading: false,
    success: false,
};

const categorySlice = createSlice({
    name: 'serviceCategory',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(categoryDataGet.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(categoryDataGet.fulfilled, (state: any, action: PayloadAction<any[]>) => {
            state.loading = false;
            state.categoryData = action.payload;
            state.success = true;
        });
        builder.addCase(categoryDataGet.rejected, (state) => {
            state.loading = false;
            state.success = false;
        });
    }
});

export default categorySlice.reducer;

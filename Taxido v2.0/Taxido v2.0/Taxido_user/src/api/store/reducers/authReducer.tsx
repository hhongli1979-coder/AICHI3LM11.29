import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  userLogin,
  userRegistration,
  self,
  userMailLogin,
  userVerifyOtp,
  socialLogin,
  firebaseOTPLogin
} from "../actions/authActions";
import { AuthInterface } from "../../interface/authInterface";

const initialState: AuthInterface = {
  user: {},
  token: "",
  loading: false,
  success: false,
  fcmToken: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateToken(state, action: PayloadAction<string>) {
      state.fcmToken = action.payload;
    },
    updateLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    //Login Cases
    builder.addCase(userLogin.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(userLogin.fulfilled, (state, action) => {
      state.loading = false;
    });

    //social login Cases
    builder.addCase(socialLogin.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(socialLogin.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.data;
    });


    //firebase otp
    builder.addCase(firebaseOTPLogin.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(firebaseOTPLogin.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.data;
    });

    //Register Cases
    builder.addCase(userRegistration.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(userRegistration.fulfilled, (state, action) => {
      state.loading = false;
    });

    //self
    builder.addCase(self.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(self.fulfilled, (state, action) => {
      state.user = action.payload;
      state.loading = false;
    });
    builder.addCase(self.rejected, (state, action) => {
      state.loading = false;
    });

    //LoginWithmail Cases
    builder.addCase(userMailLogin.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(userMailLogin.fulfilled, (state, action) => {
      state.loading = false;
    });

    //verify otp Cases
    builder.addCase(userVerifyOtp.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(userVerifyOtp.fulfilled, (state, action) => {
      state.loading = false;
    });

  },
});
export const { updateToken, updateLoading } = authSlice.actions;
export default authSlice.reducer;

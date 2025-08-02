import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  signupData: null,
  loading: false,
  token: (() => {
    try {
      const token = localStorage.getItem("token");
      return token ? JSON.parse(token) : null;
    } catch (error) {
      console.error("Error parsing token:", error);
      localStorage.removeItem("token");
      return null;
    }
  })(),
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setSignupData(state, value) {
      state.signupData = value.payload;
    },
    setLoading(state, value) {
      state.loading = value.payload;
    },
    setToken(state, value) {
      state.token = value.payload;
      if (value.payload) {
        localStorage.setItem("token", JSON.stringify(value.payload));
      } else {
        localStorage.removeItem("token");
      }
    },
  },
});

export const { setSignupData, setLoading, setToken } = authSlice.actions;

export default authSlice.reducer;
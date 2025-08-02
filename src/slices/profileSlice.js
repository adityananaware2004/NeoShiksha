import {createSlice} from "@reduxjs/toolkit"

const initialState = {
    user: (() => {
        try {
            const userData = localStorage.getItem("user");
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error("Error parsing user data:", error);
            localStorage.removeItem("user");
            return null;
        }
    })(),
    loading: false,
};

const profileSlice = createSlice({
    name:"profile",
    initialState: initialState,
    reducers: {
        setUser(state, value) {
            state.user = value.payload;
            if (value.payload) {
                localStorage.setItem("user", JSON.stringify(value.payload));
            } else {
                localStorage.removeItem("user");
            }
        },
        setLoading(state, value) {
            state.loading = value.payload;
          },
    },
});

export const {setUser, setLoading} = profileSlice.actions;
export default profileSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getAuthHeader = () => {
    const token = localStorage.getItem("token")
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
}

export const fetchProfile = createAsyncThunk("profile/fetchProfile", async () => {
    const response = await axios.get("http://localhost:5000/api/user/profile", getAuthHeader());
    return response.data;
})

export const updateProfile = createAsyncThunk("profile/updateProfile", async (data) => {
    const response = await axios.put("http://localhost:5000/api/user/profile", data, getAuthHeader());
    return response.data;
})

const profileSlice = createSlice({
    name: "profile",
    initialState: {
        profile: {},
        status: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfile.pending, (state) => {
                state.status = "pending";
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.status = "fulfilled";
                state.profile = action.payload;
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.status = "rejected";
                state.error = action.error.message;
            })
            .addCase(updateProfile.pending, (state) => {
                state.status = "pending";
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.status = "fulfilled";
                state.profile = action.payload;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.status = "rejected";
                state.error = action.error.message;
            })
    },
})

export default profileSlice.reducer;
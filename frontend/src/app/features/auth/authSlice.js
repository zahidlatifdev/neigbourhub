import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const login = createAsyncThunk('auth/login', async (data) => {
    const response = await axios.post('http://localhost:5000/api/user/login', data);
    localStorage.setItem('token', response.data.token);
    return response.data;
});

export const register = createAsyncThunk('auth/register', async (data) => {
    const response = await axios.post('http://localhost:5000/api/user/register', data);
    localStorage.setItem('token', response.data.token);
    return response.data;
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        status: 'idle',
        error: null
    },
    reducers: {
        logout(state) {
            state.user = null;
            localStorage.removeItem('token');
            state.token = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.status = 'pending';
            })
            .addCase(login.fulfilled, (state, action) => {
                state.status = 'fulfilled';
                state.user = action.payload;
                console.log(action.payload);
            })
            .addCase(login.rejected, (state, action) => {
                state.status = 'rejected';
                state.error = action.error.message;
            })
            .addCase(register.pending, (state) => {
                state.status = 'pending';
            })
            .addCase(register.fulfilled, (state, action) => {
                state.status = 'fulfilled';
                state.user = action.payload;
            })
            .addCase(register.rejected, (state, action) => {
                state.status = 'rejected';
                state.error = action.error.message;
            })
    }
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;

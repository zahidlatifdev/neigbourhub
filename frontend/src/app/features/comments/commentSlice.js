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

export const fetchComments = createAsyncThunk("comments/fetchComments", async (postId) => {
    const response = await axios.get(`http://localhost:5000/api/post/${postId}/comments`);
    return response.data;
})

export const createComment = createAsyncThunk("comments/createComment", async (data) => {
    const response = await axios.post(`http://localhost:5000/api/post/${data.postId}/comments`, data, getAuthHeader());
    return response.data;
})

export const deleteComment = createAsyncThunk("comments/deleteComment", async (data) => {
    await axios.delete(`http://localhost:5000/api/post/${data.postId}/comments/${data.commentId}`, getAuthHeader());
    return data.commentId;
})

const commentSlice = createSlice({
    name: "comments",
    initialState: {
        comments: [],
        status: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchComments.pending, (state) => {
                state.status = "pending";
            })
            .addCase(fetchComments.fulfilled, (state, action) => {
                state.status = "fulfilled";
                state.comments = action.payload;
            })
            .addCase(fetchComments.rejected, (state, action) => {
                state.status = "rejected";
                state.error = action.error.message;
            })
            .addCase(createComment.pending, (state) => {
                state.status = "pending";
            })
            .addCase(createComment.fulfilled, (state, action) => {
                state.status = "fulfilled";
                state.comments.push(action.payload);
            })
            .addCase(createComment.rejected, (state, action) => {
                state.status = "rejected";
                state.error = action.error.message;
            })
            .addCase(deleteComment.pending, (state) => {
                state.status = "pending";
            })
            .addCase(deleteComment.fulfilled, (state, action) => {
                state.status = "fulfilled";
                state.comments = state.comments.filter(comment => comment._id !== action.payload);
            })
            .addCase(deleteComment.rejected, (state, action) => {
                state.status = "rejected";
                state.error = action.error.message;
            })
    },
})

export default commentSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const getAuthHeader = () => {
    const token = localStorage.getItem("token")
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
}

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
    const response = await axios.get("http://localhost:5000/api/post");
    return response.data;
})

export const createPost = createAsyncThunk("posts/createPost", async (data) => {
    const response = await axios.post("http://localhost:5000/api/post", data, getAuthHeader());
    return response.data;
})

export const deletePost = createAsyncThunk("posts/deletePost", async (id) => {
    await axios.delete(`http://localhost:5000/api/post/${id}`, getAuthHeader());
    return id;
})

export const updatePost = createAsyncThunk("posts/updatePost", async (data) => {
    const response = await axios.put(`http://localhost:5000/api/post/${data.id}`, data, getAuthHeader());
    return response.data;
})

const postsSlice = createSlice({
    name: "posts",
    initialState: {
        posts: [],
        status: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPosts.pending, (state) => {
                state.status = "pending";
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = "fulfilled";
                state.posts = action.payload;
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = "rejected";
                state.error = action.error.message;
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.posts.push(action.payload);
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                state.posts = state.posts.filter((post) => post.id !== action.payload);
            })
            .addCase(updatePost.fulfilled, (state, action) => {
                const { id, title, content } = action.payload;
                const existingPost = state.posts.find((post) => post.id === id);
                if (existingPost) {
                    existingPost.title = title;
                    existingPost.content = content;
                }
            })
    }
})

export default postsSlice.reducer;
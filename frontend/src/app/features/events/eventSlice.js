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

export const fetchEvents = createAsyncThunk("events/fetchEvents", async () => {
    const response = await axios.get("http://localhost:5000/api/event");
    return response.data;
})

export const fetchEventById = createAsyncThunk("events/fetchEventById", async (id) => {
    const response = await axios.get(`http://localhost:5000/api/event/${id}`, getAuthHeader());
    return response.data;
})

export const createEvent = createAsyncThunk("events/createEvent", async (data) => {
    const response = await axios.post("http://localhost:5000/api/event", data, getAuthHeader());
    return response.data;
})

export const deleteEvent = createAsyncThunk("events/deleteEvent", async (id) => {
    await axios.delete(`http://localhost:5000/api/event/${id}`, getAuthHeader());
    return id;
})

export const updateEvent = createAsyncThunk("events/updateEvent", async (data) => {
    const response = await axios.put(`http://localhost:5000/api/event/${data.eventId}`, data, getAuthHeader());
    
    return response.data;
})

export const getAttendees = createAsyncThunk("events/getAttendees", async (eventId) => {
    const response = await axios.get(`http://localhost:5000/api/event/${eventId}/attend`, getAuthHeader());
    return response.data;
})

export const addAttendee = createAsyncThunk("events/addAttendee", async (data) => {
    const response = await axios.post(`http://localhost:5000/api/event/${data.eventId}/attend`, { email: data.email }, getAuthHeader());
    return response.data;
})

export const removeAttendee = createAsyncThunk("events/removeAttendee", async (data) => {
    const response = await axios.delete(`http://localhost:5000/api/event/${data.eventId}/attend`, { data: { email: data.email }, ...getAuthHeader() });
    return response.data;
})

const eventSlice = createSlice({
    name: "events",
    initialState: {
        events: [],
        status: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchEvents.pending, (state) => {
                state.status = "pending";
            })
            .addCase(fetchEvents.fulfilled, (state, action) => {
                state.status = "fulfilled";
                state.events = action.payload;
            })
            .addCase(fetchEvents.rejected, (state, action) => {
                state.status = "rejected";
                state.error = action.error.message;
            })
            .addCase(fetchEventById.pending, (state) => {
                state.status = "pending";
            })
            .addCase(fetchEventById.fulfilled, (state, action) => {
                state.status = "fulfilled";
                state.events.push(action.payload);
            })
            .addCase(createEvent.pending, (state) => {
                state.status = "pending";
            })
            .addCase(createEvent.fulfilled, (state, action) => {
                state.status = "fulfilled";
                state.events.push(action.payload);
            })
            .addCase(createEvent.rejected, (state, action) => {
                state.status = "rejected";
                state.error = action.error.message;
            })
            .addCase(deleteEvent.pending, (state) => {
                state.status = "pending";
            })
            .addCase(deleteEvent.fulfilled, (state, action) => {
                state.status = "fulfilled";
                state.events = state.events.filter((event) => event._id !== action.payload);
            })
            .addCase(deleteEvent.rejected, (state, action) => {
                state.status = "rejected";
                state.error = action.error.message;
            })
            .addCase(updateEvent.pending, (state) => {
                state.status = "pending";
            })
            .addCase(updateEvent.fulfilled, (state, action) => {
                state.status = "fulfilled";
                state.events = state.events.map((event) => {
                    if (event._id === action.payload._id) {
                        return action.payload;
                    }
                    return event;
                });
            })
            .addCase(updateEvent.rejected, (state, action) => {
                state.status = "rejected";
                state.error = action.error.message;
            })
            .addCase(getAttendees.pending, (state) => {
                state.status = "pending";
            })
            .addCase(getAttendees.fulfilled, (state, action) => {
                state.status = "fulfilled";
                const event = state.events.find((event) => event._id === action.payload._id);
                event.attendees = action.payload.attendees;
            })
            .addCase(getAttendees.rejected, (state, action) => {
                state.status = "rejected";
                state.error = action.error.message;
            })
            .addCase(addAttendee.pending, (state) => {
                state.status = "pending";
            })
            .addCase(addAttendee.fulfilled, (state, action) => {
                state.status = "fulfilled";
                const event = state.events.find((event) => event._id === action.payload._id);
                event.attendees = action.payload.attendees;
            })
    },
})

export default eventSlice.reducer;
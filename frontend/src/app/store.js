import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import postsReducer from "./features/posts/postsSlice.js";
import authReducer from "./features/auth/authSlice.js";
import profileReducer from "./features/profile/profileSlice.js";
import commentReducer from "./features/comments/commentSlice.js";
import eventReducer from "./features/events/eventSlice.js";

const rootReducer = combineReducers({
    posts: postsReducer,
    auth: authReducer,
    profile: profileReducer,
    comments: commentReducer,
    events: eventReducer,
});

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
});

export const persistor = persistStore(store);

export { store };

import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import wordpressReducer from './wordpressSlice'; // Import the actual reducer

const rootReducer = combineReducers({
    wordpress: wordpressReducer, // Use the reducer function
});

const persistConfig = {
    key: 'root',
    storage,
    version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);   
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; // Optional: If you want to use this type for dispatch

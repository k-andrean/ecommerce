import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import userSlice from "store/reducer/user";
import cartSlice from "store/reducer/cart";

const persistConfig = {
	key: "root",
	storage,
};

const rootReducer = combineReducers({
	userData: userSlice,
	cartData: cartSlice
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) => {
		return getDefaultMiddleware({
			serializableCheck: false
		});
	},
});

export const persistor = persistStore(store);
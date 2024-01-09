import { configureStore } from "@reduxjs/toolkit";
import { applicationSlice } from "./application/slice";

const store = configureStore({
    reducer: {
      [applicationSlice.name]: applicationSlice.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(),
});


export default store;


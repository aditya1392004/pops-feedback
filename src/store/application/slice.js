import { createSlice } from "@reduxjs/toolkit";
import { reducers } from "./reducer";

const initialState = {
  "merchant": {},
  "feedback": {}
};

export const applicationSlice = createSlice({
  name: "application",
  initialState,
  reducers: reducers,
});

export const applicationActions = applicationSlice.actions;



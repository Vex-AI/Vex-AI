import { configureStore } from "@reduxjs/toolkit";
import vexReducer from "./reducers/vexReducer";

const store = configureStore({
  reducer: {
    vex: vexReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

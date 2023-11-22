import { createSlice } from "@reduxjs/toolkit";

const defaultState = {
  users: [],
  user: {}
};
export const userSlice = createSlice({
  name: "user",
  initialState: defaultState,
  reducers: {
    setAllUsers: (state, action) => ({
      ...state,
      users: action.payload
    }),
    setUser: (state, action) => ({
      ...state,
      user: action.payload
    })
  }
});

export const { setAllUsers, setUser, setReciever } = userSlice.actions;

export default userSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  _id: "",
  fullName: "",
  email: "",
  profile_img: "",
  token: JSON.parse(localStorage.getItem("accessToken")) || "",
  onlineUser: [],
  socketConnection: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state._id = action.payload._id;
      state.fullName = action.payload.fullName;
      state.email = action.payload.email;
      state.profile_img = action.payload.profile_img;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    logout: (state) => {
      state._id = "";
      state.fullName = "";
      state.email = "";
      state.profile_img = "";
      state.token = "";
      state.socketConnection = null;
    },
    setOnlineUser: (state, action) => {
      state.onlineUser = action.payload;
    },
    setSocketConnection: (state, action) => {
      state.socketConnection = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUser, setToken, logout, setOnlineUser, setSocketConnection } =
  userSlice.actions;

export default userSlice.reducer;

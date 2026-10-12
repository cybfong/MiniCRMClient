import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  username: '',
  token: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateName(state, action) {
      state.username = action.payload;
    },
    updateToken(state, action) {
      state.token = action.payload;
    },
    logout: () => initialState,
  },
});

export const { updateName, updateToken, logout } = authSlice.actions;

export default authSlice.reducer;

export const getUsername = (state) => state.auth.username;
export const getToken = (state) => state.auth.token;

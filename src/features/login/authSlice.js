import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userId: '',
  fullName: '',
  userName: '',
  email: '',
  role: '',
  enabled: true,
  token: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateToken(state, action) {
      state.token = action.payload;
    },
    setAuthDetails(state, action) {
      state.userId = action.payload.id;
      state.fullName = action.payload.fullName;
      state.userName = action.payload.userName;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.enabled = action.payload.enabled;
    },
    logout: () => initialState,
  },
});

export const { updateToken, setAuthDetails, logout } = authSlice.actions;

export default authSlice.reducer;

export const getFullName = (state) => state.auth.fullName;

export const getUserName = (state) => state.auth.userName;

// export const getUserId = (state) => state.auth.userId;

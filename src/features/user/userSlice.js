import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userid: '',
  fullname: '',
  email: '',
  role: '',
  enabled: true,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateFullname(state, action) {
      state.fullname = action.payload;
    },
  },
});

export default userSlice.reducer;

export const { updateFullname } = userSlice.actions;

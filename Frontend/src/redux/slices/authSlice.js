// redux/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { authApiSlice } from '../api/authApiSlice';
import { profileApiSlice } from '../api/profileApiSlice';
import { jobApiSlice } from '../api/jobsApiSlice';
import { vehicleApiSlice } from '../api/vehicleApiSlice';
import { notificationApiSlice } from '../api/notificationApiSlice';
import { recommendationApiSlice } from '../api/recommendationApiSlice';
import { pdfApiSlice } from '../api/pdfApiSlice';
import { contractorApiSlice } from '../api/contractorApiSlice';
import { ownerApiSlice } from '../api/ownerApiSlice';
import { workerApiSlice } from '../api/workerApiSlice';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    userType: null,
    token: null,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = typeof user === 'string' ? JSON.parse(user) : user;
      state.userType = user.userType;
      state.token = token;
    },
    
    logout: (state) => {
      state.user = null;
      state.userType = null;
      state.token = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export const logoutAndClearData = () => (dispatch) => {
  dispatch(logout());
  dispatch(authApiSlice.util.resetApiState()); 
  dispatch(profileApiSlice.util.resetApiState());
  dispatch(jobApiSlice.util.resetApiState());
  dispatch(vehicleApiSlice.util.resetApiState());
  dispatch(notificationApiSlice.util.resetApiState());
  dispatch(recommendationApiSlice.util.resetApiState());
  dispatch(pdfApiSlice.util.resetApiState());
  dispatch(contractorApiSlice.util.resetApiState());
  dispatch(ownerApiSlice.util.resetApiState());
  dispatch(workerApiSlice.util.resetApiState());
};

export default authSlice.reducer;

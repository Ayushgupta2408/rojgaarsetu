import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useGetCurrentUserQuery } from './redux/api/authApiSlice';
// Auth Components
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import OTPVerification from './components/Auth/OTPVerification';

// Dashboard Components
import WorkerDashboard from './components/Dashboard/WorkerDashboard';
import ContractorDashboard from './components/Dashboard/ContractorDashboard';
import OwnerDashboard from './components/Dashboard/OwnerDashboard';

// Profile Components
import WorkerProfile from './components/Profile/WorkerProfile';
import ContractorProfile from './components/Profile/ContractorProfile';
import OwnerProfile from './components/Profile/OwnerProfile';

// Job Components
import JobPostingForm from './components/Job/JobPostingForm';
import JobApplicationForm from './components/Job/JobApplicationForm';

//Application Components
import ApplicationsOnJob from './components/Application/ApplicationsOnJob';
import SingleApplication from './components/Application/SingleApplication';
import SingleVehicleApplication from './components/Application/SingleVehicleApplication';
import ApplicationsOnVehicle from './components/Application/ApplicationsOnVehicle';

// Vehicle Components
import VehicleForm from './components/Vehicle/VehicleForm';

// Notification Components
import NotificationItem from './components/Notifications/NotificationItem';

// PDF Components
import PDFViewer from './components/PDFViewer/PDFViewer';

// Recommendation Components
import RecommendationList from './components/Recommendations/RecommendationList';

// Pages
import Home from './pages/Home';
import Navbar from './components/home/Navbar';
import SingleJobPost from './components/Job/SingleJobPost';
import { setCredentials } from './redux/slices/authSlice';
import SingleVehiclePost from './components/Vehicle/SingleVehiclePost';

import AllJobs from './components/Job/AllJobs';
import AllVehicles from './components/Vehicle/AllVehicles';
import VehicleApplication from './components/Vehicle/VehicleApplication';
function App() {
  const dispatch = useDispatch();
  const { user, userType, loading } = useSelector(state => state.auth);
  const { data: me, isSuccess } = useGetCurrentUserQuery();

  useEffect(() => {
    if (isSuccess) {
      // Capitalize userType here if your backend still sends lowercase
      const capitalizedType =
        me.user.userType.charAt(0).toUpperCase() + me.user.userType.slice(1);

      dispatch(setCredentials({
        user: me.user,
        userType: capitalizedType,
        token: me.token
      }));
    }
  }, [isSuccess, me, dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const isAuthenticated = !!user;

  return (
    <Router>
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/register"
          element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />}
        />
        <Route path="/verify-otp" element={<OTPVerification />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              userType === 'Worker' ? <WorkerDashboard /> :
              userType === 'Contractor' ? <ContractorDashboard /> :
              userType === 'Owner' ? <OwnerDashboard /> :
              <Navigate to="/login" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Worker Routes */}
        <Route
          path="/worker/profile"
          element={isAuthenticated && userType === 'Worker'
            ? <WorkerProfile />
            : <Navigate to="/login" />}
        />
        <Route
          path="/job/apply/:id"
          element={isAuthenticated && userType === 'Worker'
            ? <JobApplicationForm />
            : <Navigate to="/login" />}
        />
        <Route
          path="/job/all"
          element={isAuthenticated && userType === 'Worker'
            ? <AllJobs />
            : <Navigate to="/login" />}
        />
        {/* Contractor Routes */}
        <Route
          path="/contractor/profile"
          element={isAuthenticated && userType === 'Contractor'
            ? <ContractorProfile />
            : <Navigate to="/login" />}
        />
        <Route
          path="/job/create"
          element={isAuthenticated && userType === 'Contractor'
            ? <JobPostingForm />
            : <Navigate to="/login" />}
        />
        <Route
          path="/job/view/:id"
          element={isAuthenticated 
            ? <SingleJobPost />
            : <Navigate to="/login" />}
        />
        <Route
          path="/job/edit/:id"
          element={isAuthenticated && userType === 'Contractor'
            ? <JobPostingForm />
            : <Navigate to="/login" />}
        />
        <Route
          path="/job/application/:applicationId"
          element={isAuthenticated
            ? <SingleApplication />
            : <Navigate to="/login" />}
        />
        <Route 
         path='/job/applications/:jobId'
         element={isAuthenticated && userType === 'Contractor' 
            ? <ApplicationsOnJob />
            : <Navigate to="/login" />} 
            />
             <Route
          path="/vehicle/view/:id"
          element={isAuthenticated
            ? <SingleVehiclePost />
            : <Navigate to="/login" />}
        />
        <Route
          path="/vehicle/application/:applicationId"
          element={isAuthenticated
            ? <SingleVehicleApplication />
            : <Navigate to="/login" />}
        />
        <Route
          path="/vehicle/applications/:vehicleId"
          element={isAuthenticated && userType === 'Contractor'
            ? <ApplicationsOnVehicle /> 
            : <Navigate to="/login" />}
        />
        <Route
          path="/vehicle/create"
          element={isAuthenticated && userType === 'Contractor'
            ? <VehicleForm />
            : <Navigate to="/login" />}
        />

        {/* Owner Routes */}
        <Route
          path="/owner/profile"
          element={isAuthenticated && userType === 'Owner'
            ? <OwnerProfile />
            : <Navigate to="/login" />}
        />
        <Route
          path='vehicle/all'
          element={isAuthenticated && userType === 'Owner'
            ? <AllVehicles />
            : <Navigate to="/login" />}
        />
        <Route
          path="/vehicle/apply/:id"
          element={isAuthenticated && userType === 'Owner'
            ? <VehicleApplication />
            : <Navigate to="/login" />}
        />
        {/* Common Routes */}
        <Route
          path="/notifications"
          element={isAuthenticated
            ? <NotificationItem />
            : <Navigate to="/login" />}
        />
        <Route
          path="/pdf/:type/:id"
          element={isAuthenticated
            ? <PDFViewer />
            : <Navigate to="/login" />}
        />
        <Route
          path="/recommendations"
          element={isAuthenticated
            ? <RecommendationList />
            : <Navigate to="/login" />}
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;

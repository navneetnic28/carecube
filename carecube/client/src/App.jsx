import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Explore from "./pages/Explore";
import DoctorProfile from "./pages/DoctorProfile";
import CentreProfile from "./pages/CentreProfile";

import PatientDashboard from "./pages/patient/PatientDashboard";
import MyAppointments from "./pages/patient/MyAppointments";

import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorSchedule from "./pages/doctor/DoctorSchedule";
import DoctorProfileEdit from "./pages/doctor/DoctorProfileEdit";
import DoctorBookPatient from "./pages/doctor/DoctorBookPatient";

import CentreDashboard from "./pages/centre/CentreDashboard";
import CentreDoctors from "./pages/centre/CentreDoctors";
import CentreQueue from "./pages/centre/CentreQueue";
import WalkIn from "./pages/centre/WalkIn";

import AdminDashboard from "./pages/admin/AdminDashboard";
import PendingDoctors from "./pages/admin/PendingDoctors";
import PendingCentres from "./pages/admin/PendingCentres";
import AdminAllDoctors from "./pages/admin/AdminAllDoctors";
import AdminAllCentres from "./pages/admin/AdminAllCentres";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAppointments from "./pages/admin/AdminAppointments";
import AdminReports from "./pages/admin/AdminReports";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/doctor/:id" element={<DoctorProfile />} />
      <Route path="/centre/:id" element={<CentreProfile />} />

      {/* Patient */}
      <Route
        path="/patient/dashboard"
        element={
          <ProtectedRoute role="patient">
            <PatientDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/appointments"
        element={
          <ProtectedRoute role="patient">
            <MyAppointments />
          </ProtectedRoute>
        }
      />

      {/* Doctor */}
      <Route
        path="/doctor/dashboard"
        element={
          <ProtectedRoute role="doctor">
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/schedule"
        element={
          <ProtectedRoute role="doctor">
            <DoctorSchedule />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/book"
        element={
          <ProtectedRoute role="doctor">
            <DoctorBookPatient />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/profile"
        element={
          <ProtectedRoute role="doctor">
            <DoctorProfileEdit />
          </ProtectedRoute>
        }
      />

      {/* Centre Owner */}
      <Route
        path="/centre/dashboard"
        element={
          <ProtectedRoute role="centre_owner">
            <CentreDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/centre/doctors"
        element={
          <ProtectedRoute role="centre_owner">
            <CentreDoctors />
          </ProtectedRoute>
        }
      />
      <Route
        path="/centre/queue"
        element={
          <ProtectedRoute role="centre_owner">
            <CentreQueue />
          </ProtectedRoute>
        }
      />
      <Route
        path="/centre/walk-in"
        element={
          <ProtectedRoute role="centre_owner">
            <WalkIn />
          </ProtectedRoute>
        }
      />

      {/* Admin */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/doctors/pending"
        element={
          <ProtectedRoute role="admin">
            <PendingDoctors />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/centres/pending"
        element={
          <ProtectedRoute role="admin">
            <PendingCentres />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/doctors"
        element={
          <ProtectedRoute role="admin">
            <AdminAllDoctors />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/centres"
        element={
          <ProtectedRoute role="admin">
            <AdminAllCentres />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute role="admin">
            <AdminUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/appointments"
        element={
          <ProtectedRoute role="admin">
            <AdminAppointments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute role="admin">
            <AdminReports />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

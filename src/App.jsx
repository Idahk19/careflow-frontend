import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import AdminDashboard from "./pages/Admindashboard";
import Departments from "./pages/Departments";
import Doctors from "./pages/Doctors";
import Services from "./pages/Services";
import Patients from "./pages/Patients";
import Appointments from "./pages/Appointments";
import Profile from "./pages/Profile";
import DoctorDashboard from "./pages/DoctorDashboard";

function App() {
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/departments" element={<Departments />} />
        <Route path="/admin/doctors" element={<Doctors />} />
        <Route path="/admin/services" element={<Services />} />
        <Route path="/admin/patients" element={<Patients />} />
        <Route path="/admin/appointments" element={<Appointments />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Signup from "./pages/signup";
import ForgetPassword from "./pages/forgetpassword";
import VerificationCode from "./pages/VerificationCode";
import ResetPassword from "./pages/resetpassword";
import Dashboard from "./pages/dashboard";
import VerifyOtp from "./pages/VerifyOtp";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/verify-code" element={<VerificationCode />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;

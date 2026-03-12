import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import AuthenticatedRoute from "./components/auth/authenticated.route";
import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/dashboard/Dashboard";
import UnAuthenticatedRoute from "./components/auth/unauthenticated.route";
import InterviewPage from "./pages/Interview/Interview";
import NewInterviewPage from "./pages/Interview/NewInterview";
import { UserProvider } from "./context/user/user.context";
import Landing from "./pages/Landing/Lading";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger)

function App() {
  return (
    <UserProvider>
      <Toaster position="bottom-center" />
      <Routes>
        <Route
          path="/dashboard"
          element={
            <AuthenticatedRoute variant="dashboard" >
              <Dashboard />
            </AuthenticatedRoute>
          }
        />
        <Route path="/" element={<Landing />} />
        <Route
          path="/login"
          element={
            <UnAuthenticatedRoute>
              <Login />
            </UnAuthenticatedRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <UnAuthenticatedRoute>
              <Signup />
            </UnAuthenticatedRoute>
          }
        />
        <Route
          path="/interview/:id"
          element={
            <AuthenticatedRoute variant="interview">
              <InterviewPage />
            </AuthenticatedRoute>
          }
        />
        <Route
          path="/interview/new"
          element={
            <AuthenticatedRoute variant="new-interview">
              <NewInterviewPage />
            </AuthenticatedRoute>
          }
        />
      </Routes>
    </UserProvider>
  );
}

export default App;

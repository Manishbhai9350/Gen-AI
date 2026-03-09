import { Route, Routes } from "react-router-dom";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import AuthenticatedRoute from "./components/auth/authenticated.route";
import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/Dashboard";
import UnAuthenticatedRoute from "./components/auth/unauthenticated.route";
import InterviewPage from "./pages/Interview/Interview";

function App() {
  return (
    <>
      <Toaster position="bottom-center" />
      <Routes>
        <Route
          path="/dashboard"
          element={
            <AuthenticatedRoute>
              <Dashboard />
            </AuthenticatedRoute>
          }
        />
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
            <AuthenticatedRoute>
              <InterviewPage />
            </AuthenticatedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;

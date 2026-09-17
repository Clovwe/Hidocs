import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
import Dashboard from "./pages/Dashboard";
import UserForms from "./pages/UserForms";
import History from "./pages/History";
import Profile from "./pages/Profile";
import FormDetails from "./pages/FormDetails";
import FillForm from "./pages/FillForm";
import SubmitSuccess from "./pages/SubmitSuccess";
import FormResult from "./pages/FormResult";
import AdminDashboard from "./pages/AdminDashboard";
import AdminFormDetails from "./pages/AdminFormDetails";
import AdminResults from "./pages/AdminResults";
import ManageForms from "./pages/ManageForms";
import CreateForm from "./pages/CreateForm";
import EditForm from "./pages/EditForm";
import ImportWord from "./pages/ImportWord";
import AdminProfile from "./pages/AdminProfile";
import ChooseRole from "./pages/ChooseRole";

function ScrollManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const root = document.getElementById("root");

    body.classList.remove("modal-open", "offcanvas-open");

    ["overflow", "height", "position"].forEach((p) => html.style.removeProperty(p));
    ["overflow", "overflow-x", "overflow-y", "height", "max-height", "position", "padding-right"].forEach((p) =>
      body.style.removeProperty(p)
    );

    if (root) {
      ["overflow", "height", "max-height", "position"].forEach((p) => root.style.removeProperty(p));
    }

    html.style.cssText += "overflow-x:hidden;overflow-y:auto;height:auto;min-height:100%;";
    body.style.cssText += "overflow-x:hidden;overflow-y:auto;height:auto;min-height:100vh;";

    if (root) {
      root.style.cssText += "width:100%;min-height:100vh;height:auto;overflow:visible;";
    }

    window.scrollTo(0, 0);
    document.querySelectorAll(".modal-backdrop,.offcanvas-backdrop").forEach((el) => el.remove());
  }, [pathname]);

  return null;
}

function AppRoutes() {
  return (
    <>
      <ScrollManager />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login"       element={<Login />} />
        <Route path="/register"    element={<Register />} />
        <Route path="/verify-otp"  element={<VerifyOtp />} />
        <Route path="/choose-role" element={<ChooseRole />} />

        <Route element={<AppLayout />}>
          {/* User Routes */}
          <Route path="/dashboard"          element={<Dashboard />} />
          <Route path="/forms"              element={<UserForms />} />
          <Route path="/history"            element={<History />} />
          <Route path="/profile"            element={<Profile />} />
          <Route path="/form-details/:id"   element={<FormDetails />} />
          <Route path="/fill-form/:id"      element={<FillForm />} />
          <Route path="/submit-success"     element={<SubmitSuccess />} />
          <Route path="/form-result/:id"    element={<FormResult />} />

          {/* Admin Routes */}
          <Route path="/admin"                     element={<AdminDashboard />} />
          <Route path="/admin/profile"             element={<AdminProfile />} />
          <Route path="/admin/forms"               element={<ManageForms />} />
          <Route path="/create-form"               element={<CreateForm />} />
          <Route path="/admin/import-word"         element={<ImportWord />} />
          <Route path="/admin/forms/:id/edit"      element={<EditForm />} />
          <Route path="/admin/forms/:id/results"   element={<AdminResults />} />
          <Route path="/admin/forms/:id"           element={<AdminFormDetails />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;

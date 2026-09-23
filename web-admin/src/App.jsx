import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Vendors from "./pages/Vendors";
import DeliveryBoys from "./pages/DeliveryBoys";
import Orders from "./pages/Orders";
import Layout from "./components/Layout";

function isAuthed() {
  return !!localStorage.getItem("token");
}

function Protected({ children }) {
  return isAuthed() ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <Protected>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/vendors" element={<Vendors />} />
                <Route path="/delivery-boys" element={<DeliveryBoys />} />
                <Route path="/orders" element={<Orders />} />
              </Routes>
            </Layout>
          </Protected>
        }
      />
    </Routes>
  );
}

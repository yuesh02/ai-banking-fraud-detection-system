import {
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import ProtectedRoute from
  "./components/common/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Alerts from "./pages/Alerts";
import LiveMonitoring from "./pages/LiveMonitoring";
import SystemHealth from "./pages/SystemHealth";
import Login from "./pages/Login";
import TransactionDetails from "./pages/TransactionDetails";

function App() {

  return (

    <Routes>

      {/* LOGIN */}

      <Route
        path="/login"
        element={<Login />}
      />

      {/* DASHBOARD */}

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* TRANSACTIONS */}

      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Transactions />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* TRANSACTION DETAILS */}

      <Route
        path="/transactions/:id"
        element={
          <ProtectedRoute>
            <MainLayout>
              <TransactionDetails />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* ALERTS */}

      <Route
        path="/alerts"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Alerts />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* LIVE */}

      <Route
        path="/live"
        element={
          <ProtectedRoute>
            <MainLayout>
              <LiveMonitoring />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* SYSTEM */}

      <Route
        path="/system"
        element={
          <ProtectedRoute>
            <MainLayout>
              <SystemHealth />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* FALLBACK */}

      <Route
        path="*"
        element={<Navigate to="/" />}
      />

    </Routes>

  );

}

export default App;
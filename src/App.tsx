
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

// SysAdmin pages
import SysAdminDashboard from "./pages/sysadmin/Dashboard";
import StoreLayout from "./pages/sysadmin/StoreLayout";
import Icons from "./pages/sysadmin/Icons";
import Labels from "./pages/sysadmin/Labels";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import Orders from "./pages/admin/Orders";
import Employees from "./pages/admin/Employees";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* SysAdmin routes */}
            <Route 
              path="/sysadmin" 
              element={
                <ProtectedRoute allowedRoles={["sysadmin"]}>
                  <SysAdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/sysadmin/layout" 
              element={
                <ProtectedRoute allowedRoles={["sysadmin"]}>
                  <StoreLayout />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/sysadmin/icons" 
              element={
                <ProtectedRoute allowedRoles={["sysadmin"]}>
                  <Icons />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/sysadmin/labels" 
              element={
                <ProtectedRoute allowedRoles={["sysadmin"]}>
                  <Labels />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/products" 
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Products />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/orders" 
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Orders />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/employees" 
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Employees />
                </ProtectedRoute>
              } 
            />
            
            {/* Redirect root to login */}
            <Route path="/" element={<Login />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

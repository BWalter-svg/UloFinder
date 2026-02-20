import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LayoutRoute from "./Components/LayoutRoute";

// Public pages
import Landing from "./Pages/Landing";
import Login from "./Pages/Auth/Login";
import ForgotPassword from "./Pages/Auth/ForgotPassword";
import ResetPassword from "./Pages/Auth/ResetPassword";
import Signup from "./Pages/Auth/Signup";
import OnboardingLandlord from "./Pages/OnboardingLandlord";
import OnboardingTenant from "./Pages/OnboardingTenant";
import HelpPage from "./Pages/HelpPage";

// Landlord pages
import LandlordDashboard from "./Pages/Landlord/Dashboard";
import Messages from "./Pages/Landlord/MessagesPage";
import LandlordPropertyPage from "./Pages/Landlord/PropertyPage";
import LandlordRentTracking from "./Pages/Landlord/RentTracking";
import LandlordMaintenance from "./Pages/Landlord/Maintenance";
import LandlordPricing from "./Pages/Landlord/Pricing";
import LandlordProfile from "./Pages/Landlord/Profile";
import AddProperty from "./Pages/Landlord/AddProperty";
import Tenants from "./Pages/Landlord/Tenants";
import Payments from "./Pages/Landlord/Payments";
import Income from "./Pages/Landlord/Income";
import LandlordRequests from "./Pages/Landlord/Requests";
import VacantUnits from "./Pages/Landlord/VacantUnits";
import RentDue from "./Pages/Landlord/RentDue";
import Applica from "./Pages/Landlord/Applica";
import Alerts from "./Pages/Alerts";
import Settings from "./Pages/Settings";
import TenantmDashboard from "./Pages/Landlord/TenantmDashboard";

// Tenant pages
import TenantDashboard from "./Pages/Tenant/Dashboard";
import TenantRentHistory from "./Pages/Tenant/RentHistory";
import TenantMaintenance from "./Pages/Tenant/Maintenance";
import ExploreHouses from "./Pages/Tenant/ExploreHouses";
import HouseDetails from "./Pages/Tenant/PropertyDetails";
import TenantCurrentProperty from "./Pages/Tenant/Current-property";

// --- ADD THESE TWO IMPORTS ---
import AdminVerification from "./Pages/Admin/AdminVerification";
import AdminRoute from "./Components/AdminRoute"; 

const App: React.FC = () => {
  return (
    <Routes>
      {/* --- NEW ADMIN ROUTE (Top Priority) --- */}
      <Route 
        path="/admin/verify" 
        element={
          <AdminRoute>
            <LayoutRoute element={<AdminVerification />} />
          </AdminRoute>
        } 
      />

      {/* Public pages (no TopBar/Layout) */}
      <Route path="/" element={<LayoutRoute element={<Landing />} useLayout={false} />} />
      <Route path="/login" element={<LayoutRoute element={<Login />} useLayout={false} />} />
      <Route path="/signup" element={<LayoutRoute element={<Signup />} useLayout={false} />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/onboarding/landlord" element={<LayoutRoute element={<OnboardingLandlord />} useLayout={false} />} />
      <Route path="/onboarding/tenant" element={<LayoutRoute element={<OnboardingTenant />} useLayout={false} />} />

      {/* Landlord pages */}
      <Route path="/landlord/dashboard" element={<LayoutRoute element={<LandlordDashboard />} />} />
      <Route path="/landlord/properties" element={<LayoutRoute element={<LandlordPropertyPage />} />} />
      <Route path="/landlord/addproperty" element={<LayoutRoute element={<AddProperty />} />} />
      <Route path="/landlord/rent-tracking" element={<LayoutRoute element={<LandlordRentTracking />} />} />
      <Route path="/landlord/maintenance" element={<LayoutRoute element={<LandlordMaintenance />} />} />
      <Route path="/landlord/pricing" element={<LayoutRoute element={<LandlordPricing />} />} />
      <Route path="/landlord/profile" element={<LayoutRoute element={<LandlordProfile />} />} />
      <Route path="/landlord/tenants" element={<LayoutRoute element={<Tenants />} />} />
      <Route path="/landlord/payments" element={<LayoutRoute element={<Payments />} />} />
      <Route path="/landlord/income" element={<LayoutRoute element={<Income />} />} />
      <Route path="/landlord/vacant-units" element={<LayoutRoute element={<VacantUnits />} />} />
      <Route path="/landlord/rent-due" element={<LayoutRoute element={<RentDue />} />} />
      <Route path="/landlord/applications" element={<LayoutRoute element={<Applica />} />} />
      <Route path="/landlord/requests" element={<LayoutRoute element={<LandlordRequests />} />} />
      <Route path="/tenant" element={<LayoutRoute element={<TenantmDashboard />} />} />

      {/* Alerts / Settings */}
      <Route path="/notifications" element={<LayoutRoute element={<Alerts />} />} />
      <Route path="/settings" element={<LayoutRoute element={<Settings />} />} />
      <Route path="/messages" element={<LayoutRoute element={<Messages />} />} />
      <Route path="/help" element={<HelpPage />} />

      {/* Tenant pages */}
      <Route path="/tenant/dashboard" element={<LayoutRoute element={<TenantDashboard />} />} />
      <Route path="/tenant/explore-houses" element={<LayoutRoute element={<ExploreHouses />} />} />
      <Route path="/house/:id" element={<LayoutRoute element={<HouseDetails />} />} />
      <Route path="/tenant/rent-history" element={<LayoutRoute element={<TenantRentHistory />} />} />
      <Route path="/tenant/maintenance" element={<LayoutRoute element={<TenantMaintenance />} />} />
      <Route path="/tenant/current-property" element={<LayoutRoute element={<TenantCurrentProperty />} />} />

      {/* Catch-all - MUST stay at the very bottom */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;

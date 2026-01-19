import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LayoutRoute from "./Components/LayoutRoute";

// ... (Your existing imports)

// NEW Verification & Admin Imports
import VerificationHub from "./Pages/Landlord/VerificationHub";
import IdentityUpload from "./Pages/Landlord/IdentityUpload";
import AdminApproval from "./Pages/Admin/AdminApproval"; 

const App: React.FC = () => {
  return (
    <Routes>
      {/* Public pages (no TopBar/Layout) */}
      <Route path="/" element={<LayoutRoute element={<Landing />} useLayout={false} />} />
      <Route path="/login" element={<LayoutRoute element={<Login />} useLayout={false} />} />
      <Route path="/signup" element={<LayoutRoute element={<Signup />} useLayout={false} />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/onboarding/landlord" element={<LayoutRoute element={<OnboardingLandlord />} useLayout={false} />} />
      <Route path="/onboarding/tenant" element={<LayoutRoute element={<OnboardingTenant />} useLayout={false} />} />

      {/* Landlord & Verification Pages */}
      <Route path="/landlord/dashboard" element={<LayoutRoute element={<LandlordDashboard />} />} />
      
      {/* --- NEW VERIFICATION ROUTES --- */}
      <Route path="/landlord/verify" element={<LayoutRoute element={<VerificationHub />} />} />
      <Route path="/landlord/verify/identity" element={<LayoutRoute element={<IdentityUpload />} />} />
      
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

      {/* --- NEW ADMIN ROUTE --- */}
     <Route path="/admin/approvals" element={<LayoutRoute element={<AdminApproval />} />} />
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

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;

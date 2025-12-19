// src/Components/LayoutRoute.tsx
import React from "react";
import AppLayout from "./AppLayout";

interface LayoutRouteProps {
  element: React.ReactNode;
  useLayout?: boolean; // default true
}

const LayoutRoute: React.FC<LayoutRouteProps> = ({ element, useLayout = true }) => {
  return useLayout ? <AppLayout>{element}</AppLayout> : <>{element}</>;
};

export default LayoutRoute;
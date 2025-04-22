import React from "react";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import AdvancedBreadcrumb from "../AdvancedBreadcrumb";

export default function BreadcrumbLayout({ children }) {
  const { breadcrumbs, go } = useBreadcrumbs();

  return (
    <div className="mt-20 ">
      <AdvancedBreadcrumb path={breadcrumbs} onNavigate={go} />
      <div className="py-4">{children}</div>
    </div>
  );
}

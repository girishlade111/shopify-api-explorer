
import { Outlet } from "react-router-dom";
import { ReactNode } from "react";

interface LayoutProps {
  children?: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <main className="pt-20 mt-4">
      {children || <Outlet />}
    </main>
  );
}

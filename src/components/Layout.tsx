
import { Outlet, ReactNode } from "react-router-dom";

interface LayoutProps {
  children?: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <main className="pt-20">
      {children || <Outlet />}
    </main>
  );
}


import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  // This is now just a pass-through component for backward compatibility
  return <>{children}</>;
}

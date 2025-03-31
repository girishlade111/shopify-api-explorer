
import { Outlet } from "react-router-dom";

export function Layout() {
  return (
    <main className="pt-20">
      <Outlet />
    </main>
  );
}

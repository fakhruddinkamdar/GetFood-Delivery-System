import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const Layout = () => {
  const location = useLocation();

  // Check if the current route is under "/admin"
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 py-8">
          <Outlet />
        </div>
      </main>
      {/* Only show Footer if not on an admin route */}
      {!isAdminRoute && <Footer />}
    </div>
  );
};

export default Layout;

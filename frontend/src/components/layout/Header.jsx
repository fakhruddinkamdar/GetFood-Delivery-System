import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Drawer, Button, Badge } from "antd";
import {
  ShoppingCartOutlined,
  UserOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { getProfile } from "../../services/userService";

const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [name, setName] = useState(null);
  const [userType, setUserType] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false); // Track dropdown visibility

  useEffect(() => {
    const fetchProfile = async () => {
      if (isAuthenticated) {
        try {
          const { data } = await getProfile();
          setName(data.name);
          setIsAdmin(data.userType === "admin");
          setUserType(data.userType);

          if (data.userType === "admin") {
            navigate("/admin");
          }
        } catch (err) {
          console.error("Error:", err);
        }
      } else {
        setIsAdmin(false);
        setName(null);
        setUserType(null);
      }
    };
    fetchProfile();
  }, [isAuthenticated]);

  const handleLogout = () => {
    setIsAdmin(false);
    setName(null);
    setUserType(null);
    logout();
    navigate("/");
  };

  const MobileNav = () => (
    <div className="flex flex-col gap-4 p-4 text-lg">
      {!isAdmin && (
        <>
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/products" onClick={() => setMenuOpen(false)}>Menu</Link>
          {isAuthenticated && userType === "customer" && (
            <Link to="/orders" onClick={() => setMenuOpen(false)}>Track Order</Link>
          )}
        </>
      )}
      {isAdmin && (
        <Link to="/admin" onClick={() => setMenuOpen(false)}>Dashboard</Link>
      )}
      {!isAuthenticated && (
        <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
      )}
    </div>
  );

  const handleToggleDropdown = () => {
    setDropdownVisible((prevState) => !prevState); // Toggle dropdown visibility on click
  };

  return (
    <header className="w-full px-6 py-4 flex items-center justify-between bg-white shadow-sm fixed top-0 z-50">
      <Link to="/" className="flex items-center space-x-3">
        <img
          src="https://www.creativefabrica.com/wp-content/uploads/2021/03/24/Food-Delivery-Minimalist-Logo-Design-Graphics-9920848-1.jpg"
          alt="Logo"
          className="h-16 w-19 rounded-full"
        />
        <span className="text-xl font-extrabold text-black">Foodie Express</span>
      </Link>

      {!isAdmin && (
        <div className="hidden md:flex space-x-8 font-medium text-gray-800 text-md">
          <Link to="/" className="hover:text-red-500">Home</Link>
          <Link to="/products" className="hover:text-red-500">Menu</Link>
          {isAuthenticated && userType === "customer" && (
            <Link to="/orders" className="hover:text-red-500">Track Order</Link>
          )}
        </div>
      )}

      <div className="hidden md:flex items-center gap-4">
        {isAuthenticated && userType === "customer" && (
          <Link to="/cart">
            <Badge count={itemCount} showZero>
              <ShoppingCartOutlined className="text-2xl text-primary" />
            </Badge>
          </Link>
        )}
        {isAuthenticated ? (
          isAdmin ? (
            <div className="flex items-center gap-2 font-semibold text-gray-800">
              <UserOutlined />
              Hi, {name}
            </div>
          ) : (
            <div className="relative">
              <button
                className="flex items-center gap-1 font-semibold"
                onClick={handleToggleDropdown} // Toggle dropdown on click
              >
                <UserOutlined />
                Hi, {name}
              </button>
              {dropdownVisible && ( // Show dropdown if it's visible
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-50">
                  <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">My Profile</Link>
                  <Link to="/profile?tab=password" className="block px-4 py-2 hover:bg-gray-100">Change Password</Link>
                  <hr />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )
        ) : (
          <Link to="/login" className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            <UserOutlined className="mr-1" /> Sign In
          </Link>
        )}
      </div>

      <div className="md:hidden flex items-center gap-4">
        {isAuthenticated && userType === "customer" && (
          <Link to="/cart">
            <Badge count={itemCount} showZero>
              <ShoppingCartOutlined className="text-2xl text-primary" />
            </Badge>
          </Link>
        )}
        <Button type="text" icon={<MenuOutlined />} onClick={() => setMenuOpen(true)} />
      </div>

      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setMenuOpen(false)}
        open={menuOpen}
        bodyStyle={{ padding: 0 }}
      >
        {MobileNav()}
      </Drawer>
    </header>
  );
};

export default Header;

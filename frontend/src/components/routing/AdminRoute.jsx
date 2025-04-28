import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { getProfile } from "../../services/userService.js";
import { Spin, Layout, Typography, Tooltip } from "antd";
import {
  DashboardOutlined,
  ShoppingOutlined,
  PlusCircleOutlined,
  LogoutOutlined,
  EditOutlined,
  EyeOutlined,
  KeyOutlined,
  TeamOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

const { Content, Sider, Header } = Layout;
const { Title } = Typography;

const AdminRoute = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAdmin = async () => {
      if (isAuthenticated && user) {
        try {
          const userData = await getProfile();
          setIsAdmin(userData.data.userType === "admin");
        } catch (error) {
          console.error("Error checking admin status:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [isAuthenticated, user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" tip="Loading admin dashboard..." />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" />;
  }

  const getSelectedKey = () => {
    const path = location.pathname;
    const tab = new URLSearchParams(location.search).get("tab");
    if (path === "/admin") return ["dashboard"];
    if (path === "/admin/products") return ["products"];
    if (path === "/admin/products/add") return ["add-product"];
    if (path === "/admin/users") return ["users"];
    if (path === "/admin/orders") return ["orders"];
    if (path === "/admin/profile") {
      if (tab === "edit") return ["edit-profile"];
      if (tab === "password") return ["change-password"];
      return ["view-profile"];
    }
    return ["dashboard"];
  };

  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      link: "/admin",
    },
    {
      key: "products",
      icon: <ShoppingOutlined />,
      label: "All Dishes",
      link: "/admin/products",
    },
    {
      key: "add-product",
      icon: <PlusCircleOutlined />,
      label: "Add Dish",
      link: "/admin/products/add",
    },
    {
      key: "users",
      icon: <TeamOutlined />,
      label: "Users",
      link: "/admin/users",
    },
    {
      key: "orders",
      icon: <ShoppingCartOutlined />,
      label: "Orders",
      link: "/admin/orders",
    },
    {
      key: "view-profile",
      icon: <EyeOutlined />,
      label: "Profile",
      link: "/admin/profile",
    },
    {
      key: "edit-profile",
      icon: <EditOutlined />,
      label: "Edit Profile",
      link: "/admin/profile?tab=edit",
    },
    {
      key: "change-password",
      icon: <KeyOutlined />,
      label: "Change Password",
      link: "/admin/profile?tab=password",
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          background: "#fffcf5",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #eee",
        }}
      >
        <Title level={4} style={{ margin: 0, color: "#ff7e00" }}>
          🍽️ Foodie Admin Dashboard
        </Title>
        <Tooltip title="Logout">
          <LogoutOutlined
            onClick={logout}
            style={{ fontSize: 20, color: "#f5222d", cursor: "pointer" }}
          />
        </Tooltip>
      </Header>

      <Layout>
        <Sider
          width={80}
          style={{
            background: "#fffef7",
            borderRight: "1px solid #eee",
            boxShadow: "2px 0 8px rgba(0,0,0,0.05)",
            paddingTop: 16,
          }}
        >
          <div className="flex flex-col items-center space-y-4">
            {menuItems.map((item) => (
              <Tooltip title={item.label} placement="right" key={item.key}>
                <Link
                  to={item.link}
                  className={`text-lg p-3 rounded-md hover:bg-orange-100 transition-all duration-200 ${
                    getSelectedKey()[0] === item.key ? "bg-orange-200 text-orange-800" : "text-gray-600"
                  }`}
                >
                  {item.icon}
                </Link>
              </Tooltip>
            ))}
          </div>
        </Sider>

        <Content
          style={{
            margin: "24px",
            padding: 24,
            background: "#fff",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminRoute;

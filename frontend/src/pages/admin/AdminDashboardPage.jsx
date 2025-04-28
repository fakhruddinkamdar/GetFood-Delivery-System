import { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Spin,
  Table,
  Tag,
  Progress,
  List,
  Avatar,
  Divider,
} from "antd";
import {
  ShoppingOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
//import { getProducts } from "../../services/productService.js";
import { getProfile } from "../../services/userService.js";
import { getDashboardStats } from "../../services/adminService.js";

const { Title, Text } = Typography;

const AdminDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [productsCount, setProductsCount] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [admin, setAdmin] = useState(null);
  const [orderStats, setOrderStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    delivered: 0,
    cancelled: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [inventoryAlerts, setInventoryAlerts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const statsData = await getDashboardStats();
        const { data } = statsData;
        setProductsCount(data.counts.totalProducts);
        setTotalCustomers(data.counts.totalCustomers);
        setOrderStats({
          total: data.counts.totalOrders,
          pending: data.orderStatus.pending,
          processing: data.orderStatus.processing,
          delivered: data.orderStatus.delivered,
          cancelled: data.orderStatus.cancelled,
        });
        setTopProducts(data.topRatedProducts);
        setInventoryAlerts(data.lowStockProducts);
        setRecentOrders(data.recentOrders);
        const userData = await getProfile();
        setAdmin(userData.data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const renderOrderStatus = (status) => {
    const colorMap = {
      pending: "gold",
      processing: "blue", 
      delivered: "green",
      cancelled: "red",
    };
    return <Tag color={colorMap[status?.toLowerCase()] || "default"}>{status}</Tag>;
  };

  const getOrderStatusPercentage = (status) => {
    return orderStats.total > 0
      ? Math.round((orderStats[status.toLowerCase()] / orderStats.total) * 100)
      : 0;
  };

  const recentOrdersColumns = [
    {
      title: "Customer",
      dataIndex: "userId",
      key: "user",
      render: (user) => user?.name || "Anonymous",
    },
    {
      title: "Amount",
      dataIndex: "totalPrice",
      key: "amount",
      render: (amount) => `$${amount?.toFixed(2)}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: renderOrderStatus,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "date",
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" tip="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="admin-dashboard px-8 py-10 bg-gray-50 min-h-screen">
      <Title level={3} className="mb-6 text-gray-700">
        Welcome back Chef, <span className="text-blue-700">{admin?.name}</span> 👋
      </Title>

      <Row gutter={[20, 20]} className="mb-8">
        {[
          {
            title: "Dishes",
            value: productsCount,
            icon: <ShoppingOutlined />,
            color: "#34c38f",
          },
          {
            title: "Orders",
            value: orderStats.total,
            icon: <ShoppingCartOutlined />,
            color: "#556ee6",
          },
          {
            title: "Customers",
            value: totalCustomers,
            icon: <TeamOutlined />,
            color: "#f46a6a",
          },
          {
            title: "Your Role",
            value: admin?.userType,
            icon: <UserOutlined />,
            color: "#f1b44c",
          },
        ].map((item, i) => (
          <Col xs={24} sm={12} md={6} key={i}>
            <Card className="rounded-xl shadow-lg border-0 text-center">
              <div className="text-3xl mb-2" style={{ color: item.color }}>
                {item.icon}
              </div>
              <Statistic value={item.value} title={item.title} />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]} className="mb-10">
        <Col xs={24} lg={16}>
          <Card title="📊 Order Status Distribution" className="rounded-xl shadow-md">
            {["Pending", "Processing", "Delivered", "Cancelled"].map((status) => (
              <div key={status} className="mb-4">
                <div className="flex justify-between">
                  <Text className="capitalize">{status}</Text>
                  <Text>{orderStats[status.toLowerCase()]}</Text>
                </div>
                <Progress
                  percent={getOrderStatusPercentage(status)}
                  strokeColor={{
                    Pending: "#faad14",
                    Processing: "#1890ff",
                    Delivered: "#52c41a",
                    Cancelled: "#ff4d4f",
                  }[status]}
                  showInfo={false}
                />
              </div>
            ))}
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="⚙️ Quick Shortcuts" className="rounded-xl shadow-md">
            <List
              dataSource={[
                "Manage Dishes",
                "Add New Dish",
                "Edit Profile",
                "Change Password",
              ]}
              renderItem={(item) => (
                <List.Item className="cursor-pointer hover:bg-gray-100 px-3 py-2 rounded">
                  {item}
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Divider />

      <Row gutter={[24, 24]} className="mb-10">
        <Col xs={24} md={12}>
          <Card title="⭐ Top Rated Products" className="rounded-xl shadow-md">
            <List
              dataSource={topProducts}
              renderItem={(product) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      product.image ? (
                        <Avatar src={`/backend/public/${product.image}`} shape="square" />
                      ) : (
                        <Avatar icon={<ShoppingOutlined />} shape="square" />
                      )
                    }
                    title={product.name}
                    description={`Rating: ${product.avgRating?.toFixed(1) || "N/A"} | ₹${product.price}`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="⚠️ Inventory Alerts" className="rounded-xl shadow-md">
            {inventoryAlerts.length ? (
              <List
                dataSource={inventoryAlerts}
                renderItem={(product) => (
                  <List.Item
                    actions={[
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        product.image ? (
                          <Avatar src={`/backend/public/${product.image}`} shape="square" />
                        ) : (
                          <Avatar icon={<ShoppingOutlined />} shape="square" />
                        )
                      }
                      title={product.name}
                      description={`Price: ₹${product.price?.toFixed(2)}`}
                    />
                  </List.Item>
                )}
              />
            ) : (
              <div className="text-center py-4">
                <CheckCircleOutlined className="text-2xl text-green-500" />
                {/* <p>All products are sufficiently stocked</p> */}
              </div>
            )}
          </Card>
        </Col>
      </Row>

      <Card title="🕒 Recent Orders" className="rounded-xl shadow-md">
        <Table
          dataSource={recentOrders}
          columns={recentOrdersColumns}
          rowKey="_id"
          pagination={false}
          size="middle"
        />
      </Card>
    </div>
  );
};

export default AdminDashboardPage;

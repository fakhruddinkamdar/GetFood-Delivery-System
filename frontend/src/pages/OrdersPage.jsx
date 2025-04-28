import { Typography, Card, Row, Col } from "antd";
import OrderList from "../components/orders/OrderList";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { ShoppingOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const OrdersPage = () => {
  const { isAuthenticated, loading } = useAuth();

  // Redirect if not authenticated
  if (!loading && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen px-6 py-10 bg-yellow-50">
      <Card
        className="max-w-5xl mx-auto shadow-lg border-0 rounded-2xl bg-white"
        bodyStyle={{ padding: "2rem" }}
      >
        <div className="text-center mb-10">
          <ShoppingOutlined className="text-5xl text-orange-500 mb-4" />
          <Title level={2} className="text-orange-600">Your Orders</Title>
          <Paragraph className="text-gray-600">
            Track your past orders and reorder your favorites anytime.
          </Paragraph>
        </div>

        <div className="order-list-wrapper">
          <OrderList />
        </div>
      </Card>
    </div>
  );
};

export default OrdersPage;

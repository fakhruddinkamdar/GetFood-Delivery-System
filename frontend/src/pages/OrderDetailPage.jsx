import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, Navigate } from "react-router-dom";
import {
  Typography,
  Row,
  Col,
  Card,
  Table,
  Tag,
  Button,
  Spin,
  Alert,
  Breadcrumb,
  Divider,
} from "antd";
import {
  ArrowLeftOutlined,
  HomeOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import * as orderService from "../services/orderService";
import { useAuth } from "../context/AuthContext";

const { Title, Paragraph, Text } = Typography;

const statusColors = {
  Pending: "orange",
  Delivered: "green",
};

const OrderDetailPage = () => {
  const { id } = useParams();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await orderService.getOrder(id);
        if (response?.data) {
          setOrder(response.data);
        } else {
          setError("Order not found");
        }
      } catch (err) {
        setError(err.message || "Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && id) {
      fetchOrder();
    }
  }, [id, isAuthenticated]);

  if (!authLoading && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="text-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-20">
        <Alert
          type="error"
          message="Error"
          description={error || "Order not found"}
          showIcon
        />
        <Link to="/orders">
          <Button type="primary" className="mt-6" icon={<ArrowLeftOutlined />}>
            Back to Orders
          </Button>
        </Link>
      </div>
    );
  }

  const columns = [
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      render: (product) => (
        <div className="flex items-center">
          {product?.images?.[0] && (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-14 h-14 object-cover rounded mr-3 shadow"
            />
          )}
          <div>
            <div className="font-semibold">{product?.name}</div>
            <div className="text-gray-500 text-sm">{product?.category}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Price",
      dataIndex: "product",
      key: "price",
      render: (product) => `₹${product?.price?.toFixed(2) || "0.00"}`,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Subtotal",
      key: "subtotal",
      render: (_, record) =>
        `₹${((record.product?.price || 0) * (record.quantity || 0)).toFixed(2)}`,
    },
  ];

  return (
    <div className="min-h-screen px-6 py-10 bg-yellow-50">
      <Breadcrumb className="mb-6 text-sm">
        <Breadcrumb.Item>
          <Link to="/">
            <HomeOutlined /> Home
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/orders">
            <ShoppingOutlined /> Orders
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          Order #{order._id?.slice(-8) || "N/A"}
        </Breadcrumb.Item>
      </Breadcrumb>

      <Card
        className="max-w-6xl mx-auto shadow-md rounded-xl"
        bodyStyle={{ padding: "2rem" }}
      >
        <div className="flex justify-between items-center mb-6">
          <Title level={3} className="!text-orange-600 m-0">
            Order #{order._id?.slice(-8)}
          </Title>
          <Tag
            color={statusColors[order.status] || "default"}
            className="text-base px-4 py-1 font-medium"
          >
            {order.status}
          </Tag>
        </div>

        <Row gutter={[32, 32]} className="mb-8">
          <Col xs={24} md={12}>
            <Title level={5}>🧾 Order Info</Title>
            <Paragraph>
              <Text strong>Order Date:</Text>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </Paragraph>
            <Paragraph>
              <Text strong>Order ID:</Text> {order._id}
            </Paragraph>
          </Col>
          <Col xs={24} md={12}>
            <Title level={5}>📦 Shipping Info</Title>
            <Paragraph>
              <Text strong>Name:</Text> {order.shippingAddress?.name}
            </Paragraph>
            <Paragraph>
              <Text strong>Address:</Text> {order.shippingAddress?.address}
            </Paragraph>
            <Paragraph>
              <Text strong>City:</Text> {order.shippingAddress?.city}
            </Paragraph>
            <Paragraph>
              <Text strong>Postal Code:</Text>{" "}
              {order.shippingAddress?.postalCode}
            </Paragraph>
            {/* <Paragraph>
              <Text strong>Country:</Text> {order.shippingAddress?.country}
            </Paragraph> */}
          </Col>
        </Row>

        <Divider />

        <Title level={5} className="mb-4 text-orange-600">
          🍽️ Ordered Items
        </Title>
        <Table
          columns={columns}
          dataSource={order.products || []}
          rowKey={(record) => record.product?._id || Math.random()}
          pagination={false}
        />

        <div className="mt-8 text-right">
          <div className="inline-block bg-orange-50 rounded-lg p-4 border border-orange-200 w-full sm:w-auto sm:min-w-[300px]">
            <div className="flex justify-between mb-2">
              <Text className="text-gray-600">Subtotal:</Text>
              <Text>₹{order.totalPrice?.toFixed(2)}</Text>
            </div>
            <div className="flex justify-between mb-2">
              <Text className="text-gray-600">Shipping:</Text>
              <Text>Free</Text>
            </div>
            <Divider />
            <div className="flex justify-between font-bold text-lg text-orange-700">
              <Text>Total:</Text>
              <Text>₹{order.totalPrice?.toFixed(2)}</Text>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/orders")}
            type="primary"
            size="large"
            className="bg-orange-500 border-none hover:bg-orange-600"
          >
            Back to Orders
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default OrderDetailPage;

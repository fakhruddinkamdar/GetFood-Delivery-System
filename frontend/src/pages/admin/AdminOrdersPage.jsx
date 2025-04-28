import { useEffect, useState } from "react";
import {
  Card,
  Table,
  Tag,
  Input,
  Button,
  Typography,
  DatePicker,
  Select,
  message,
  Row,
  Col,
  Divider,
} from "antd";
import {
  SearchOutlined,
  ShoppingCartOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { getAllOrders, updateOrderStatus } from "../../services/adminService.js";

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const AdminOrdersPage = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [filters, setFilters] = useState({ status: "", customerName: "", startDate: null, endDate: null, foodCategory: "", orderId: "" });
  const [updatingOrder, setUpdatingOrder] = useState(null);

  // Function to fetch orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = { page: pagination.current, limit: pagination.pageSize, ...filters };
      const response = await getAllOrders(params);
      setOrders(response.data);
      setPagination({ ...pagination, total: response.total });
    } catch (error) {
      console.error("Error fetching orders:", error);
      message.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch orders on mount
    fetchOrders();

    // Set an interval to fetch orders every 30 seconds
    const interval = setInterval(() => {
      fetchOrders();
    }, 30000); // 30 seconds

    // Clean up the interval when the component is unmounted
    return () => clearInterval(interval);
  }, [pagination.current, pagination.pageSize, filters]);

  const handleTableChange = (pagination) => {
    setPagination({ ...pagination, current: pagination.current });
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setPagination({ ...pagination, current: 1 });
  };

  const handleDateRangeChange = (dates) => {
    if (dates && dates.length === 2) {
      setFilters({ ...filters, startDate: dates[0].startOf("day").toISOString(), endDate: dates[1].endOf("day").toISOString() });
    } else {
      setFilters({ ...filters, startDate: null, endDate: null });
    }
    setPagination({ ...pagination, current: 1 });
  };

  const resetFilters = () => {
    setFilters({ status: "", customerName: "", startDate: null, endDate: null, foodCategory: "", orderId: "" });
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingOrder(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      message.success(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
      message.error("Failed to update order status");
    } finally {
      setUpdatingOrder(null);
    }
  };

  const validStatuses = ["Pending", "Processing", "Delivered", "Cancelled"];

  const renderOrderStatus = (status, record) => {
    const isUpdating = updatingOrder === record._id;

    // Fallback to 'Pending' if status is undefined or invalid
    const safeStatus = validStatuses.includes(status) ? status : "Pending";

    return (
      <Select
        value={safeStatus}
        style={{ width: 140 }}
        onChange={(value) => handleStatusChange(record._id, value)}
        disabled={isUpdating}
        loading={isUpdating}
      >
        {validStatuses.map((statusValue) => (
          <Option key={statusValue} value={statusValue}>
            <Tag color={
              statusValue === "Pending" ? "orange" :
              statusValue === "Processing" ? "blue" :
              statusValue === "Delivered" ? "green" :
              "red"
            }>
              {statusValue}
            </Tag>
          </Option>
        ))}
      </Select>
    );
  };

  const columns = [
    {
      title: "#ID",
      dataIndex: "_id",
      key: "id",
      render: (id) => <Text ellipsis>{id}</Text>,
    },
    {
      title: "Customer",
      dataIndex: "userId",
      key: "user",
      render: (user, record) => user?.name || record.userName || "Anonymous",
    },
    {
      title: "Category",
      dataIndex: "foodCategory",
      key: "category",
    },
    {
      title: "Amount ($)",
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
    {
      title: "Payment",
      dataIndex: "paymentMethod",
      key: "payment",
    },
  ];

  return (
    <div className="text-orange-500 m-0">
      <Card bordered={false} className="shadow-lg rounded-xl mb-6">
        <Row justify="space-between" align="middle" className="mb-4">
          <Col><Title level={3}><ShoppingCartOutlined /> Manage Orders</Title></Col>
          <Col><Button onClick={resetFilters} type="default">Reset Filters</Button></Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8} lg={6}><Input placeholder="Order ID" value={filters.orderId} onChange={(e) => handleFilterChange("orderId", e.target.value)} prefix={<SearchOutlined />} allowClear /></Col>
          <Col xs={24} sm={12} md={8} lg={6}><Input placeholder="Customer Name" value={filters.customerName} onChange={(e) => handleFilterChange("customerName", e.target.value)} prefix={<SearchOutlined />} allowClear /></Col>
          <Col xs={24} sm={12} md={8} lg={6}><Select placeholder="Status" value={filters.status || undefined} onChange={(value) => handleFilterChange("status", value)} allowClear style={{ width: '100%' }}><Option value="Preparing">Preparing</Option><Option value="Ready for Pickup">Ready for Pickup</Option><Option value="Out for Delivery">Out for Delivery</Option><Option value="Completed">Completed</Option><Option value="Cancelled">Cancelled</Option></Select></Col>
          <Col xs={24} sm={12} md={8} lg={6}><Select placeholder="Food Category" value={filters.foodCategory || undefined} onChange={(value) => handleFilterChange("foodCategory", value)} allowClear style={{ width: '100%' }}><Option value="Pizza">Pizza</Option><Option value="Burgers">Burgers</Option><Option value="Drinks">Drinks</Option><Option value="Desserts">Desserts</Option></Select></Col>
          <Col xs={24} sm={24} md={16}><RangePicker style={{ width: '100%' }} onChange={handleDateRangeChange} allowClear /></Col>
        </Row>
      </Card>

      <Card bordered={false} className="shadow rounded-xl">
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="_id"
          loading={loading}
          pagination={{ current: pagination.current, pageSize: pagination.pageSize, total: pagination.total, showSizeChanger: true, pageSizeOptions: ["10", "20", "50"] }}
          onChange={handleTableChange}
          expandable={{
            expandedRowRender: (record) => (
              <div>
                <Divider orientation="left">Order Details</Divider>
                <Table
                  columns={[
                    { title: "Item", dataIndex: "productId", key: "product", render: (product) => product?.name || "Unknown" },
                    { title: "Price", dataIndex: "price", key: "price", render: (p) => `$${p?.toFixed(2)}` },
                    { title: "Qty", dataIndex: "quantity", key: "quantity" },
                    { title: "Total", key: "subtotal", render: (_, item) => `$${(item.price * item.quantity).toFixed(2)}` },
                  ]}
                  dataSource={record.products}
                  pagination={false}
                  rowKey={(item) => `${record._id}-${item.productId?._id || item.productId}`}
                />
                <Divider orientation="left">Shipping</Divider>
                <p><strong>Name:</strong> {record.shippingAddress.name}</p>
                <p><strong>Address:</strong> {record.shippingAddress.address}, {record.shippingAddress.city}, {record.shippingAddress.postalCode}</p>
                <p><strong>Phone:</strong> {record.shippingAddress.phone}</p>
              </div>
            ),
          }}
        />
      </Card>
    </div>
  );
};

export default AdminOrdersPage;

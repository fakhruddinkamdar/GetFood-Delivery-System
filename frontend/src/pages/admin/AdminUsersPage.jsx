import { useEffect, useState } from "react";
import {
  Card,
  Table,
  Tag,
  Input,
  Button,
  Typography,
  Select,
  Avatar,
  message,
  Divider,
  Tooltip,
} from "antd";
import {
  SearchOutlined,
  UserOutlined,
  TeamOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { getAllUsers } from "../../services/adminService.js";

const { Title } = Typography;
const { Option } = Select;

const AdminUsersPage = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    userType: "",
  });

  useEffect(() => {
    fetchUsers();
  }, [pagination.current, pagination.pageSize, filters]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.current,
        limit: pagination.pageSize,
        ...filters,
      };

      const response = await getAllUsers(params);
      setUsers(response.data);
      setPagination({ ...pagination, total: response.total });
    } catch (error) {
      console.error("Error fetching users:", error);
      message.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (pagination) => {
    setPagination({ ...pagination, current: pagination.current });
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setPagination({ ...pagination, current: 1 }); // Reset page
  };

  const resetFilters = () => {
    setFilters({ name: "", email: "", userType: "" });
  };

  const columns = [
    {
      title: "User",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={
              record.profileImage
                ? `/backend/public/${record.profileImage}`
                : null
            }
            icon={<UserOutlined />}
          />
          <div>
            <div className="font-semibold">{text}</div>
            <div className="text-xs text-gray-500">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (text) => text || <span className="text-gray-400">Not provided</span>,
    },
    {
      title: "Type",
      dataIndex: "userType",
      key: "userType",
      render: (type) => (
        <Tag color={type === "admin" ? "volcano" : "geekblue"}>{type}</Tag>
      ),
    },
    {
      title: "Location",
      dataIndex: "address",
      key: "address",
      render: (address) =>
        address && address.city
          ? `${address.city}, ${address.country || ""}`
          : "No address available",
    },
  ];

  return (
    <div className="p-6 bg-[#f9f9f9] min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <Title level={3} className="text-orange-500 m-0">
          <TeamOutlined className="mr-2" /> Manage Users
        </Title>

        <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
          <Input
            placeholder="Name"
            prefix={<SearchOutlined />}
            value={filters.name}
            onChange={(e) => handleFilterChange("name", e.target.value)}
            style={{ width: 180 }}
            allowClear
          />
          <Input
            placeholder="Email"
            prefix={<SearchOutlined />}
            value={filters.email}
            onChange={(e) => handleFilterChange("email", e.target.value)}
            style={{ width: 200 }}
            allowClear
          />
          <Select
            placeholder="User Role"
            value={filters.userType || undefined}
            onChange={(value) => handleFilterChange("userType", value)}
            style={{ width: 160 }}
            allowClear
          >
            <Option value="admin">Admin</Option>
            <Option value="customer">Customer</Option>
          </Select>
          <Tooltip title="Clear all filters">
            <Button
              icon={<ReloadOutlined />}
              onClick={resetFilters}
              className="bg-white border-orange-400 text-orange-500"
            >
              Reset
            </Button>
          </Tooltip>
        </div>
      </div>

      <Card
        className="shadow-md rounded-xl"
        style={{ background: "#fffefc", border: "1px solid #ffe0b2" }}
      >
        <Table
          columns={columns}
          dataSource={users}
          rowKey="_id"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
          }}
          loading={loading}
          onChange={handleTableChange}
          bordered
        />
      </Card>
    </div>
  );
};

export default AdminUsersPage;

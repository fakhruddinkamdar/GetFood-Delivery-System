import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  Popconfirm,
  Typography,
  message,
  Card,
  Tag,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { getProducts } from "../../services/productService";
import api from "../../services/api";
import API_ENDPOINTS from "../../config/apiConfig";

const { Title } = Typography;

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const loadProducts = async (
    page = 1,
    limit = 10,
    searchQuery = "",
    category = ""
  ) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit,
        ...(searchQuery && { search: searchQuery }),
        ...(category && { category }),
      };

      const response = await getProducts(params);
      setProducts(response.data);
      setPagination({
        ...pagination,
        current: page,
        total: response.total,
        pageSize: limit,
      });
    } catch (error) {
      message.error("Failed to load products");
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts(
      pagination.current,
      pagination.pageSize,
      search,
      categoryFilter
    );
  }, [pagination.current, pagination.pageSize, search, categoryFilter]);

  const handleDeleteProduct = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      message.success("Product deleted successfully");
      loadProducts(
        pagination.current,
        pagination.pageSize,
        search,
        categoryFilter
      );
    } catch (error) {
      message.error("Failed to delete product");
      console.error("Error deleting product:", error);
    }
  };

  const handleSearch = () => {
    loadProducts(1, pagination.pageSize, search, categoryFilter);
  };

  const handleCategoryFilter = () => {
    loadProducts(1, pagination.pageSize, search, categoryFilter);
  };

  const handleTableChange = (pagination) => {
    loadProducts(
      pagination.current,
      pagination.pageSize,
      search,
      categoryFilter
    );
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "images",
      key: "image",
      render: (images) => (
        <img
          src={
            images && images.length > 0
              ? `${API_ENDPOINTS.base}/uploads/${images[0]}`
              : ""
          }
          alt="Product"
          className="w-14 h-14 object-cover rounded-md border border-gray-200"
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name) => <span className="font-semibold text-gray-700">{name}</span>,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category) => (
        <Tag color="processing" className="rounded-full px-2 py-1 text-sm">{category}</Tag>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
      render: (price) => (
        <span className="text-orange-600 font-bold">₹{price.toFixed(2)}</span>
      ),
    },
    
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/admin/products/edit/${record._id}`}>
            <Button
              icon={<EditOutlined />}
              shape="circle"
              size="small"
              className="!border-orange-400 !text-orange-500 hover:!bg-orange-100"
              title="Edit"
            />
          </Link>
          <Popconfirm
            title="Delete this product?"
            onConfirm={() => handleDeleteProduct(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              shape="circle"
              size="small"
              className="hover:!bg-red-100 !text-red-500 !border-red-300"
              title="Delete"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-6 bg-[#fffaf0] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="text-orange-600">🍔 Manage Food Items</Title>
        <Link to="/admin/products/add">
          <Button type="primary" icon={<PlusOutlined />} className="bg-orange-500 border-orange-500">
            Add New Item
          </Button>
        </Link>
      </div>

      <Card className="mb-6 shadow-md bg-white">
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onPressEnter={handleSearch}
            prefix={<SearchOutlined />}
            className="max-w-md"
          />
          <Input
            placeholder="Filter by category..."
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            onPressEnter={handleCategoryFilter}
            className="max-w-md"
          />
          <Button type="default" onClick={handleSearch} className="bg-orange-400 text-white">
            Search
          </Button>
        </div>
      </Card>

      <Card className="shadow-xl border border-gray-200 rounded-2xl overflow-hidden">
        <Table
          columns={columns}
          dataSource={products}
          rowKey="_id"
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
          className="modern-ant-table"
        />
      </Card>
    </div>
  );
};

export default AdminProductsPage;

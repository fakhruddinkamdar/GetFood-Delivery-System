import { useState } from "react";
import {
  Form,
  Input,
  Button,
  InputNumber,
  Upload,
  Card,
  Typography,
  message,
  Select,
  Divider,
  Badge,
} from "antd";
import {
  UploadOutlined,
  PlusOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { createProduct } from "../../services/productService";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const categories = [
  "Appetizers",
  "Main Course",
  "Desserts",
  "Beverages",
  "Fast Food",
  "Healthy Meals",
  "Breakfast",
  "Snacks",
  "Seafood",
  "Vegetarian",
  "Others",
];

const AdminAddProductPage = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);

      if (fileList.length === 0) {
        message.error("Please upload at least one dish image.");
        setSubmitting(false);
        return;
      }

      const productData = {
        ...values,
        images: fileList.map((file) => file.originFileObj),
      };

      await createProduct(productData);
      message.success("Dish added successfully 🍽️");
      navigate("/admin/products");
    } catch (error) {
      console.error("Error adding dish:", error);
      message.error("Failed to add dish. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  return (
    <div className="p-6 bg-[#fffaf2] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <Badge.Ribbon text="" color="#ffa94d">
          <Title level={2} className="text-orange-500 m-0">
            🍽️ Create New Dish
          </Title>
        </Badge.Ribbon>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/admin/products")}
          className="border-orange-400 text-orange-500"
        >
          Back
        </Button>
      </div>

      <Card
        className="rounded-xl shadow-lg"
        style={{ borderColor: "#ffe4b5", background: "#fffef6" }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        
        >
          <Divider orientation="left" orientationMargin="0">
            📝 Dish Details
          </Divider>

          <Form.Item
            name="name"
            label="Dish Name"
            rules={[
              { required: true, message: "Please enter the dish name" },
              { max: 100, message: "Name cannot exceed 100 characters" },
            ]}
          >
            <Input placeholder="e.g., Spicy Paneer Tikka" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter a description" }]}
          >
            <TextArea
              rows={3}
              placeholder="Describe ingredients, taste, and preparation..."
            />
          </Form.Item>

          <Divider orientation="left" orientationMargin="0">
            💰 Pricing & Availability
          </Divider>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item
              name="price"
              label="Price (₹)"
              rules={[
                { required: true, message: "Please enter the price" },
                { type: "number", min: 0, message: "Price must be non-negative" },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                formatter={(value) =>
                  `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/₹\s?|(,*)/g, "")}
              />
            </Form.Item>

            
          </div>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: "Please select a category" }]}
          >
            <Select placeholder="Select category for the dish">
              {categories.map((cat) => (
                <Option key={cat} value={cat}>
                  {cat}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Divider orientation="left" orientationMargin="0">
            📸 Dish Images
          </Divider>

          <Form.Item
            label="Upload Dish Images"
            tooltip="Upload up to 5 dish images"
            required
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleImageChange}
              beforeUpload={() => false}
              multiple
            >
              {fileList.length < 5 && (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
            <p className="text-gray-500 text-sm mt-1">
              Tip: First image will be the primary display image.
            </p>
          </Form.Item>

          <Form.Item>
            <div className="flex justify-end gap-4 mt-6">
              <Button onClick={() => navigate("/admin/products")}>Cancel</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                style={{ backgroundColor: "#ff7e00", borderColor: "#ff7e00" }}
              >
                Add Dish
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AdminAddProductPage;

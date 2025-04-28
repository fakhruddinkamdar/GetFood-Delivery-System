import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Select,
  Divider,
  Typography,
  Steps,
  Result,
  Card,
  List,
  Row,
  Col,
  Alert,
} from "antd";
import {
  ShoppingOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import { useCart } from "../context/CartContext";
import * as orderService from "../services/orderService";

const { Title, Text } = Typography;
const { Option } = Select;

const CheckoutPage = () => {
  const [current, setCurrent] = useState(0);
  const [shippingAddress, setShippingAddress] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("creditCard");
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [error, setError] = useState("");

  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();

  const steps = [
    { title: "Shipping", icon: <ShoppingOutlined /> },
    { title: "Payment", icon: <CreditCardOutlined /> },
    { title: "Confirmation", icon: <CheckCircleOutlined /> },
  ];

  const handleShippingSubmit = (values) => {
    setShippingAddress(values);
    setCurrent(1);
  };

  const handlePaymentSubmit = (values) => {
    setPaymentMethod(values.paymentMethod);
    setCurrent(2);
  };

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const products = cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }));

      const orderData = {
        products,
        shippingAddress,
        paymentMethod,
      };

      const response = await orderService.placeOrder(orderData);

      setOrderId(response.data._id);
      setOrderPlaced(true);
      clearCart();
    } catch (err) {
      setError(err.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderShippingForm = () => (
    <Card className="max-w-2xl mx-auto shadow-lg rounded-2xl">
      <Form
        layout="vertical"
        onFinish={handleShippingSubmit}
        initialValues={shippingAddress}
      >
        <Title level={3} className="text-center text-orange-500 mb-6">
          Delivery Information
        </Title>

        <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
          <Input placeholder="John Doe" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true },
            { type: "email", message: "Invalid email" },
          ]}
        >
          <Input placeholder="example@email.com" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone"
          rules={[
            { required: true },
            {
              pattern: /^[6-9]\d{9}$/,
              message: "Invalid Indian phone number",
            },
          ]}
        >
          <Input placeholder="9876543210" />
        </Form.Item>

        <Form.Item
          name="address"
          label="Street Address"
          rules={[{ required: true }]}
        >
          <Input placeholder="123 Main St" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="city" label="City" rules={[{ required: true }]}>
              <Input placeholder="Mumbai" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="postalCode"
              label="Postal Code"
              rules={[{ required: true }]}
            >
              <Input placeholder="400001" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Button onClick={() => navigate("/cart")}>
              <LeftOutlined /> Back to Cart
            </Button>
          </Col>
          <Col span={12} className="text-right">
            <Button type="primary" htmlType="submit" className="bg-orange-500 hover:bg-orange-600">
              Continue to Payment
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );

  const renderPaymentForm = () => (
    <Card className="max-w-2xl mx-auto shadow-lg rounded-2xl">
      <Form
        layout="vertical"
        onFinish={handlePaymentSubmit}
        onValuesChange={(changedValues) => {
          if (changedValues.paymentMethod) {
            setPaymentMethod(changedValues.paymentMethod);
          }
        }}
        initialValues={{ paymentMethod }}
      >
        <Title level={3} className="text-center text-orange-500 mb-6">
          Select Payment Method
        </Title>
  
        <Form.Item
          name="paymentMethod"
          rules={[{ required: true, message: "Select a payment method" }]}
        >
          <Select placeholder="Choose a method">
            <Option value="creditCard">Credit Card</Option>
            <Option value="UPI_ID">UPI ID</Option>
            <Option value="Cash_On_Delivery">Cash On Delivery</Option>
          </Select>
        </Form.Item>
  
        {paymentMethod === "creditCard" && (
          <>
            <Form.Item name="cardNumber" label="Card Number" rules={[{ required: true }]}>
              <Input placeholder="1234 5678 9012 3456" />
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="expiryDate" label="Expiry Date" rules={[{ required: true }]}>
                  <Input placeholder="MM/YY" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="cvv" label="CVV" rules={[{ required: true }]}>
                  <Input placeholder="123" />
                </Form.Item>
              </Col>
            </Row>
          </>
        )}
  
  {paymentMethod === "UPI_ID" && (
  <Form.Item
    name="UPI_ID"
    label="UPI ID"
    rules={[
      { required: true, message: "Please enter your UPI ID" },
      {
        pattern: /^[\w.-]+@[a-zA-Z]+$/,
        message: "Please enter a valid UPI ID (e.g., name@bank)",
      },
    ]}
  >
    <Input placeholder="example@upi" />
  </Form.Item>
)}

        {paymentMethod === "Cash_On_Delivery" && (
          <Alert message="Please pay to the delivery partner in cash upon delivery." type="info" showIcon />
        )}
  
        <Row gutter={16}>
          <Col span={12}>
            <Button onClick={() => setCurrent(0)}>
              <LeftOutlined /> Back to Shipping
            </Button>
          </Col>
          <Col span={12} className="text-right">
            <Button type="primary" htmlType="submit" className="bg-orange-500 hover:bg-orange-600">
              Review Order
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
  

  const renderOrderReview = () => (
    <Card className="max-w-3xl mx-auto shadow-lg rounded-2xl">
      <Title level={3} className="text-orange-500 mb-6 text-center">
        Confirm Your Order
      </Title>

      <div className="mb-4">
        <Title level={5}>Shipping Details</Title>
        <Text>{shippingAddress.name}, {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}</Text><br />
        <Text>{shippingAddress.phone}</Text>
      </div>

      <div className="mb-4">
        <Title level={5}>Payment Mode</Title>
        <Text>
          {paymentMethod === "creditCard" && "Credit Card"}
          {paymentMethod === "UPI_ID" && "UPI ID"}
          {paymentMethod === "Cash_On_Delivery" && "Cash On Delivery"}
        </Text>
      </div>

      <Divider />

      <Title level={5}>Order Items</Title>
      <List
        dataSource={cart}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={<img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />}
              title={item.name}
              description={`Qty: ${item.quantity}`}
            />
            <Text>₹{(item.price * item.quantity).toFixed(2)}</Text>
          </List.Item>
        )}
      />

      <Divider />

      <div className="flex justify-between">
        <Text strong>Order Total</Text>
        <Text strong>₹{total.toFixed(2)}</Text>
      </div>

      {error && <Alert message="Error" description={error} type="error" showIcon className="mt-4" />}

      <Row gutter={16} className="mt-6">
        <Col span={12}>
          <Button onClick={() => setCurrent(1)}>
            <LeftOutlined /> Back to Payment
          </Button>
        </Col>
        <Col span={12} className="text-right">
          <Button
            type="primary"
            loading={loading}
            onClick={handlePlaceOrder}
            className="bg-green-600 hover:bg-green-700"
          >
            Place Order
          </Button>
        </Col>
      </Row>
    </Card>
  );

  const renderOrderConfirmation = () => (
    <Result
      status="success"
      title="Your order has been placed!"
      subTitle={`Order ID: ${orderId ? orderId.slice(-8) : "N/A"}`}
      extra={[
        <Button type="primary" key="orders" onClick={() => navigate(`/orders/${orderId}`)}>
          View Order
        </Button>,
        <Button key="buy" onClick={() => navigate("/products")}>
          Order More Food
        </Button>,
      ]}
    />
  );

  return (
    <div className="py-10 px-4 bg-yellow-50 min-h-screen">
      <Title level={2} className="text-center text-orange-600 mb-8">
        Checkout
      </Title>
      <Steps
        current={orderPlaced ? 3 : current}
        items={steps}
        className="max-w-4xl mx-auto mb-10"
      />
      {orderPlaced ? renderOrderConfirmation() : (
        <>
          {current === 0 && renderShippingForm()}
          {current === 1 && renderPaymentForm()}
          {current === 2 && renderOrderReview()}
        </>
      )}
    </div>
  );
};

export default CheckoutPage;

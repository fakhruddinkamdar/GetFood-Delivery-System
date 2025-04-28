import { Button, Empty, Divider, Typography, Alert } from "antd";
import { ShoppingCartOutlined, CreditCardOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import CartItem from "../components/orders/CartItem";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const { Title } = Typography;

const CartPage = () => {
  const { cart, total, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    navigate("/checkout");
  };

  return (
    <div className="bg-yellow-50 min-h-screen py-10 px-6">
      <Title level={2} className="text-center text-orange-600 mb-10">
        <ShoppingCartOutlined className="mr-2" />
        Your Cart – Let’s Eat!
      </Title>

      {cart.length === 0 ? (
        <div className="text-center py-20">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span className="text-lg font-medium text-gray-600">
                🍴 Your cart is feeling empty! Let’s fill it up.
              </span>
            }
          />
          <Link to="/products">
            <Button type="primary" size="large" className="mt-6 bg-orange-500 hover:bg-orange-600">
              Browse Delicious Dishes
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          {/* Right Side - Order Summary */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100">
              <Title level={4} className="text-orange-500 mb-4">
                Order Summary
              </Title>

              <div className="flex justify-between py-1 text-gray-700">
                <span>Items ({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
                <span>₹{total.toFixed(2)}</span>
              </div>

              <div className="flex justify-between py-1 text-gray-700">
                <span>Delivery Fee</span>
                <span className="text-green-600 font-semibold">Free</span>
              </div>

              <Divider className="my-4" />

              <div className="flex justify-between font-semibold text-xl text-orange-600">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>

              <Button
                type="primary"
                icon={<CreditCardOutlined />}
                size="large"
                block
                className="mt-6 bg-orange-500 hover:bg-orange-600 rounded-xl"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>

              <Button
                danger
                block
                className="mt-3 rounded-xl"
                onClick={clearCart}
              >
                Clear Cart
              </Button>

              {!isAuthenticated && (
                <Alert
                  message="Login Required"
                  description="Please log in to complete your order."
                  type="info"
                  showIcon
                  className="mt-4"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;

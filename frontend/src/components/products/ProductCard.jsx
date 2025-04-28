import { Card, Button, Rate } from "antd";
import { ShoppingCartOutlined, EyeOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useMessage } from "../../context/MessageContext";
import API_ENDPOINTS from "../../config/apiConfig";

const { Meta } = Card;

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const message = useMessage();
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent triggering card click
    if (!isAuthenticated) {
      message.warning("Please login to add items to your cart", 2);
      navigate("/login");
      return;
    }
    addToCart(product);
    message.success(
      <div className="flex items-center">
        <ShoppingCartOutlined className="mr-2 text-lg" />
        <span>
          <strong>{product.name}</strong> added to cart!
        </span>
      </div>,
      3
    );
  };

  const imageUrl =
    product.images && product.images.length
      ? `${API_ENDPOINTS.base}/uploads/${product.images[0]}`
      : "https://via.placeholder.com/300x300";

  return (
    <Link to={`/products/${product._id}`}>
      <Card
        hoverable
        className="transition-all duration-300 transform hover:scale-105 shadow-md rounded-lg bg-white"
        cover={
          <div className="relative h-56 overflow-hidden rounded-lg bg-gray-100">
            <img
              alt={product.name}
              src={imageUrl}
              className="object-cover w-full h-full"
            />
            <div className="absolute top-2 right-2 bg-white bg-opacity-60 rounded-full p-2">
              <Rate disabled defaultValue={product.averageRating} allowHalf />
            </div>
          </div>
        }
        onClick={() => navigate(`/products/${product._id}`)}
      >
        <Meta
          title={
            <span className="text-xl font-bold text-gray-800 hover:text-primary-500">
              {product.name}
            </span>
          }
          description={
            <div className="mt-2">
              <p className="text-sm text-gray-600 truncate">{product.description}</p>
              <div className="flex justify-between items-center mt-3">
                <span className="text-lg font-semibold text-food-green">₹{product.price}</span>
              </div>
            </div>
          }
        />
        <div className="mt-4 flex justify-center">
          <Button
            type="primary"
            onClick={handleAddToCart}
            className="flex items-center mx-auto text-sm"
            icon={<ShoppingCartOutlined />}
          >
            Add to Cart
          </Button>
        </div>
      </Card>
    </Link>
  );
};

export default ProductCard;

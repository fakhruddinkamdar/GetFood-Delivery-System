import { Typography, Button } from "antd";
import { Link } from "react-router-dom";
import ProductList from "../components/products/ProductList.jsx";

const { Title, Paragraph } = Typography;

const ProductsPage = () => {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="hero-section bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-center py-16">
        <Title level={1} className="text-4xl font-extrabold mb-4">
          Taste the Best Dishes in Town
        </Title>
        <Paragraph className="mb-6 text-lg">
          Discover delicious dishes delivered to your doorstep! Don't miss out on our limited-time offers!
        </Paragraph>
        <Link 
  to="/products" 
  className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg text-xl shadow-lg hover:shadow-xl transition-all duration-300"
>
  Order Now
</Link>

      </div>

      {/* Products Section */}
      <div className="py-12 px-4 md:px-16">
        <Title level={2} className="mb-8 text-center text-3xl font-bold text-food-green">
          All Dishes
        </Title>
        <ProductList />
      </div>
    </div>
  );
};

export default ProductsPage;

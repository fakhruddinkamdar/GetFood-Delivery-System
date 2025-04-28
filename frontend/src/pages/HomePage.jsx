import { useEffect, useState } from "react";
import { Button, Row, Col, Typography, Spin, Input } from "antd";
import { Link } from "react-router-dom";
import { ArrowRightOutlined } from "@ant-design/icons";
import * as productService from "../services/productService";
import ProductCard from "../components/products/ProductCard";

const { Title, Paragraph } = Typography;

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const featured = await productService.getProducts({ limit: 4, sort: "-price" });
        setFeaturedProducts(featured.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white font-sans">
      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row justify-between items-center px-10 py-20 bg-orange-50">
        <div className="max-w-xl">
          <p className="text-orange-600 font-semibold text-xl mb-1">Hungry?</p>
          <h1 className="text-5xl font-black mb-4 leading-tight">
            Wait a minute for <br />
            <span className="text-orange-500">delicious.</span>
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            Best cooks and best delivery guys all at your service. Hot tasty food will reach you in 20mins.
          </p>
          <div className="flex gap-2">
            <Input
              placeholder="Enter your delivery location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="rounded-lg py-2 px-4 w-full max-w-md"
            />
            <Button
              type="primary"
              shape="round"
              icon={<ArrowRightOutlined />}
              className="bg-green-500 hover:bg-green-600 text-white px-6"
              >
              Discover
            </Button>
          </div>
          <p className="text-sm mt-4">
            Already a member? <Link to="/login" className="text-orange-600 font-medium">Sign in</Link>
          </p>
        </div>
        <div className="w-full lg:w-1/2 mt-10 lg:mt-0">
          <img
            src="https://th.bing.com/th/id/OIP.-wwmYTGJbRWH4j_YXafLHQHaGU?w=229&h=196&c=7&r=0&o=5&dpr=1.3&pid=1.7" // Replace with your local/online image
            alt="Delivery Guy"
            className="w-full max-w-md mx-auto"
          />
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <Title level={2} className="text-orange-600">Food near me 🔥</Title>
            <Link to="/products">
              <Button type="link" className="text-orange-500 font-semibold">
                View All
              </Button>
            </Link>
          </div>
          {loading ? (
            <div className="text-center py-10">
              <Spin size="large" />
            </div>
          ) : (
            <Row gutter={[24, 24]}>
              {featuredProducts.map((product) => (
                <Col xs={24} sm={12} md={6} key={product._id}>
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;

/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Typography,
  Row,
  Col,
  Button,
  InputNumber,
  Carousel,
  Tabs,
  Rate,
  Form,
  Input,
  Spin,
  Alert,
  Breadcrumb,
  message,
} from "antd";
import {
  ShoppingCartOutlined,
  ArrowLeftOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import * as productService from "../services/productService";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import API_ENDPOINTS from "../config/apiConfig";

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productService.getProduct(id);
        setProduct(response.data);
      } catch (err) {
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleQuantityChange = (value) => {
    setQuantity(value);
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      message.warning("Please login to add items to your cart", 2);
      navigate("/login");
      return;
    }
    if (product && quantity > 0) {
      addToCart(product, quantity);
      message.success(`${quantity} x ${product.name} added to cart!`, 3);
    }
  };

  const handleReviewSubmit = async (values) => {
    try {
      setReviewSubmitting(true);
      setReviewError("");
      setReviewSuccess(false);
      await productService.addReview(id, values);
      setReviewSuccess(true);
      const response = await productService.getProduct(id);
      setProduct(response.data);
    } catch (err) {
      setReviewError("Failed to submit review");
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-16">
        <Alert type="error" message="Error" description={error || "Product not found"} showIcon />
        <Link to="/products">
          <Button className="mt-4" icon={<ArrowLeftOutlined />}>
            Back to Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#fafafa] p-6 sm:p-10 min-h-screen">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6 text-base">
        <Breadcrumb.Item>
          <Link to="/">
            <HomeOutlined /> Home
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/products">Products</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{product.name}</Breadcrumb.Item>
      </Breadcrumb>

      {/* Main Content */}
      <Row gutter={[40, 32]} className="flex flex-col md:flex-row-reverse">
        {/* Carousel Section */}
        <Col xs={24} md={12}>
          <div className="bg-white rounded-2xl shadow-lg p-4">
            {product.images && product.images.length > 0 ? (
              <Carousel autoplay className="rounded-lg overflow-hidden">
                {product.images.map((image, index) => (
                  <div key={index}>
                    <img
                      src={`${API_ENDPOINTS.base}/uploads/${image}`}
                      alt={`${product.name} - Image ${index + 1}`}
                      className="w-full h-[400px] object-cover rounded-xl"
                    />
                  </div>
                ))}
              </Carousel>
            ) : (
              <div className="h-[400px] bg-gray-100 flex items-center justify-center rounded-xl">
                <p className="text-gray-400">No images available</p>
              </div>
            )}
          </div>
        </Col>

        {/* Product Info */}
        <Col xs={24} md={12}>
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <Title level={2} className="text-3xl font-semibold text-gray-800 mb-2">
              {product.name}
            </Title>

            {product.averageRating && (
              <div className="flex items-center mb-3">
                <Rate disabled defaultValue={product.averageRating} />
                <span className="ml-2 text-gray-500">
                  ({product.reviews?.length || 0} reviews)
                </span>
              </div>
            )}

            <Title level={3} className="text-2xl text-red-500 mb-4">
              ₹{product.price}
            </Title>

            <Paragraph className="text-gray-600 mb-3">{product.description}</Paragraph>

            <div className="text-sm text-gray-500 mb-6">
              Category: <span className="font-medium">{product.category}</span>
            </div>

            <div className="flex items-center mb-6 gap-3">
              <span className="text-gray-600">Quantity:</span>
              <InputNumber
                min={1}
                defaultValue={1}
                onChange={handleQuantityChange}
                className="rounded-md border border-gray-300"
              />
            </div>

            <Button
              type="primary"
              size="large"
              icon={<ShoppingCartOutlined />}
              onClick={handleAddToCart}
              className="w-full bg-gradient-to-r from-green-500 to-lime-500 text-white shadow-lg hover:scale-105 transition-transform"
            >
              Add to Cart
            </Button>
          </div>
        </Col>
      </Row>

      {/* Tabs */}
      <div className="mt-12">
        <Tabs defaultActiveKey="1" centered className="custom-tabs">
        <TabPane tab="Description" key="1">
  <div className="bg-white p-6 rounded-lg shadow-lg">
    <div className="flex items-center space-x-4 mb-6">
      <div className="w-8 h-8 bg-blue-500 rounded-full flex justify-center items-center text-white">
        <span className="font-bold text-xl">D</span>
      </div>
      <div>
        <Title level={3} className="text-2xl font-semibold text-gray-800">
          Product Description
        </Title>
      </div>
    </div>

    <div className="text-lg leading-relaxed text-gray-700">
      <p className="mb-4">
        {product.description}
      </p>

      {/* Optional: Add Features/Specifications */}
      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
        
        <ul className="list-inside list-disc text-gray-600">
          {product.features?.map((feature, index) => (
            <li key={index} className="mb-2 text-lg">{feature}</li>
          ))}
        </ul>
      </div>

      {/* Optional: Add Specification Table */}
      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
     
        <table className="table-auto w-full text-gray-600">
          <tbody>
            {product.specifications?.map((spec, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-2 font-semibold">{spec.name}</td>
                <td className="py-2">{spec.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</TabPane>


          <TabPane tab="Reviews" key="2">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((review) => (
                  <div key={review._id} className="mb-6 border-b border-gray-200 pb-4">
                    <Rate disabled defaultValue={review.rating} />
                    <Paragraph className="mt-2 text-gray-700">{review.comment}</Paragraph>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No reviews yet.</p>
              )}

              {isAuthenticated ? (
                <div className="mt-8">
                  <Title level={4}>Write a Review</Title>

                  {reviewSuccess && (
                    <Alert
                      message="Review Submitted"
                      description="Your review has been submitted successfully."
                      type="success"
                      showIcon
                      className="mb-4"
                    />
                  )}

                  {reviewError && (
                    <Alert
                      message="Error"
                      description={reviewError}
                      type="error"
                      showIcon
                      className="mb-4"
                    />
                  )}

                  <Form name="review" onFinish={handleReviewSubmit} layout="vertical">
                    <Form.Item name="rating" rules={[{ required: true, message: "Please rate this product" }]}>
                      <Rate />
                    </Form.Item>
                    <Form.Item name="comment">
                      <TextArea rows={4} placeholder="Write your review here..." />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={reviewSubmitting}
                        className="w-full md:w-auto bg-orange-600 text-white"
                      >
                        Submit Review
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              ) : (
                <div className="mt-8 p-4 bg-gray-50 rounded-md">
                  <p>
                    Please <Link to="/login" className="text-blue-500">log in</Link> to write a review.
                  </p>
                </div>
              )}
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default ProductDetailPage;

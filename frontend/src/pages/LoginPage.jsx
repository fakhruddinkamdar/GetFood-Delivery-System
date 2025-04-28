import { Card } from "antd"; // Importing the Card component from Ant Design for UI container
import LoginForm from "../components/auth/LoginForm"; // Importing a custom LoginForm component
import { Typography } from "antd"; // Importing Typography components for styled text

// Destructuring Title and Paragraph from Typography for convenience
const { Title, Paragraph } = Typography;

const LoginPage = () => {
  return (
    // Main container with full screen height, gradient background, and centered content
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center px-4">
      
      {/* Ant Design Card as the login box */}
      <Card
        className="w-full max-w-md rounded-2xl shadow-lg border-none bg-white"
        bodyStyle={{ padding: "2.5rem" }} // Inline style to control inner padding
      >

        {/* Logo and Welcome Message */}
        <div className="text-center mb-6">
          {/* Logo image */}
          <img
            src="https://www.creativefabrica.com/wp-content/uploads/2021/03/24/Food-Delivery-Minimalist-Logo-Design-Graphics-9920848-1.jpg"
            alt="Food Delivery Logo"
            className="h-34 mx-auto mb-4 object-contain" // Logo sizing and alignment
          />

          {/* Page Title */}
          <Title level={3} className="!text-orange-500 !mb-1">
            Welcome to Foodie Express
          </Title>

          {/* Subtitle / Description */}
          <Paragraph className="!text-gray-500 !text-sm">
            Please log in to manage your orders and deliveries.
          </Paragraph>
        </div>

        {/* LoginForm Component where users enter credentials */}
        <LoginForm />
      </Card>
    </div>
  );
};

export default LoginPage; // Exporting the LoginPage component for use in routes

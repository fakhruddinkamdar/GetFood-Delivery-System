import { Card, Typography } from "antd";
import RegisterForm from "../components/auth/RegisterForm";

const { Title, Paragraph } = Typography;

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center px-4">
      <Card
        className="w-full max-w-md rounded-2xl shadow-lg border-none bg-white"
        bodyStyle={{ padding: "2.5rem" }}
      >
        <div className="text-center mb-6">
          <img
            src="https://www.creativefabrica.com/wp-content/uploads/2021/03/24/Food-Delivery-Minimalist-Logo-Design-Graphics-9920848-1.jpg"
            alt="Food Delivery Logo"
            className="h-34 mx-auto mb-4 object-contain"
          />
          <Title level={3} className="!text-orange-500 !mb-1">
            Join Foodie Express
          </Title>
          <Paragraph className="!text-gray-500 !text-sm">
            Create an account to start ordering your favorite meals.
          </Paragraph>
        </div>
        <RegisterForm />
      </Card>
    </div>
  );
};

export default RegisterPage;

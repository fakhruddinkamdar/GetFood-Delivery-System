import { useState } from "react";
import { Form, Input, Button, message, Card } from "antd";
import { changePassword } from "../../services/userService";
import { useNavigate } from "react-router-dom";

const ChangePasswordForm = ({ navigateAfterSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const response = await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      if (response.success) {
        message.success({
          content: "Password changed successfully",
          duration: 2,
          className: "custom-message",
        });
        form.resetFields();

        // Navigate to specified path if provided
        if (navigateAfterSuccess) {
          navigate(navigateAfterSuccess);
        }
      }
    } catch (error) {
      console.error(error);
      message.error({
        content: error.message || "Failed to change password",
        duration: 3,
        className: "custom-message",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <Card
        title="Change Password"
        className="bg-white shadow-xl rounded-lg"
        bordered={false}
        style={{ width: "100%", maxWidth: "500px", margin: "auto" }}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="currentPassword"
            label="Current Password"
            rules={[{ required: true, message: "Please enter your current password" }]}
          >
            <Input.Password placeholder="Enter your current password" />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, message: "Please enter a new password" },
              { min: 4, message: "Password must be at least 4 characters" },
            ]}
          >
            <Input.Password placeholder="Enter your new password" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm New Password"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Please confirm your new password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("The two passwords do not match"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm your new password" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              style={{ borderRadius: "8px" }}
            >
              Change Password
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ChangePasswordForm;

import { useState, useEffect } from "react";
import { Typography, Row, Col, Card, Spin, Tabs, message, Button } from "antd";
import { useAuth } from "../../context/AuthContext";
import { getProfile } from "../../services/userService";
import UpdateProfileForm from "./UpdateProfileForm";
import ChangePasswordForm from "./ChangePasswordForm";
import { useLocation, useNavigate } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";
import API_ENDPOINTS from "../../config/apiConfig";

const { Title } = Typography;

const ProfileComponent = ({ isAdmin = false }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const tabFromUrl = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState("profile");
  const [editMode, setEditMode] = useState(tabFromUrl === "edit");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await getProfile();

        if (response && response.success && response.data) {
          setProfile(response.data);
        } else {
          message.error({
            content: "Invalid profile data received",
            duration: 3,
            className: "custom-message",
          });
          console.error("Invalid profile data:", response);
        }
      } catch (error) {
        message.error({
          content: "Failed to load profile",
          duration: 3,
          className: "custom-message",
        });
        console.error("Profile error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (tabFromUrl === "password") {
      setActiveTab("password");
      setEditMode(false);
    } else if (tabFromUrl === "edit") {
      setActiveTab("profile");
      setEditMode(true);
    } else {
      setActiveTab("profile");
      setEditMode(false);
    }
  }, [tabFromUrl]);

  const handleProfileUpdate = (updatedProfile) => {
    setProfile(updatedProfile);
    const basePath = isAdmin ? "/admin/profile" : "/profile";
    navigate(basePath); // Go back to profile tab
    message.success({
      content: "Profile updated successfully",
      duration: 2,
      className: "custom-message",
    });
  };

  const toggleEditMode = () => {
    const basePath = isAdmin ? "/admin/profile" : "/profile";
    if (editMode) {
      navigate(basePath);
    } else {
      navigate(`${basePath}?tab=edit`);
    }
  };

  const handleTabChange = (key) => {
    const basePath = isAdmin ? "/admin/profile" : "/profile";
    if (key === "password") {
      navigate(`${basePath}?tab=password`);
    } else {
      navigate(basePath);
    }
  };

  const ProfileView = () => (
    <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-indigo-600">
      <div className="flex justify-between items-center mb-6">
        <Title level={4} className="text-indigo-600 font-semibold">
          Profile Information
        </Title>
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={toggleEditMode}
          className="flex items-center bg-indigo-600 hover:bg-indigo-700 transition-all"
        >
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        {[["Full Name", profile?.name], ["Email", profile?.email], ["Phone Number", profile?.phoneNumber], ["User Type", profile?.userType], ["Street Address", profile?.address?.street], ["City", profile?.address?.city], ["State/Province", profile?.address?.state], ["Postal Code", profile?.address?.postalCode]].map(
          ([label, value]) => (
            <div key={label} className="border border-gray-300 rounded-xl overflow-hidden shadow-md bg-white">
              <div className="bg-indigo-100 px-4 py-2 border-b border-gray-300">
                <span className="font-medium text-gray-700">{label}</span>
              </div>
              <div className="px-4 py-3">
                <span>{value || "Not set"}</span>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );

  const items = [
    {
      key: "profile",
      label: "Profile",
      children: profile && (editMode ? <UpdateProfileForm profile={profile} onSuccess={handleProfileUpdate} onCancel={() => setEditMode(false)} isAdmin={isAdmin} /> : <ProfileView />),
    },
    {
      key: "password",
      label: "Change Password",
      children: <ChangePasswordForm navigateAfterSuccess={isAdmin ? "/admin/profile" : "/profile"} />,
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <Title level={2} className="mb-6 text-center text-indigo-600">
        {isAdmin ? "Admin Profile" : "My Profile"}
      </Title>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <Card className="mb-6 text-center shadow-xl rounded-xl">
            <div className="mb-4">
              {profile?.profileImage ? (
                <img
                  src={`${API_ENDPOINTS.base}${profile.profileImage}`}
                  alt="Profile"
                  className="rounded-full w-48 h-48 mx-auto object-cover shadow-lg hover:shadow-2xl transition-all"
                />
              ) : (
                <div className="bg-gray-300 rounded-full w-48 h-48 mx-auto flex items-center justify-center">
                  <span className="text-4xl text-gray-500">{profile?.name?.charAt(0)?.toUpperCase() || "U"}</span>
                </div>
              )}
            </div>
            <Title level={3} className="text-indigo-700">{profile?.name || "User"}</Title>
            <p className="text-gray-500">{profile?.email || ""}</p>
            <p className="text-gray-500 capitalize">{profile?.userType || "User"}</p>
            {profile?.phoneNumber && <p className="text-gray-500">{profile.phoneNumber}</p>}
          </Card>
        </Col>

        <Col xs={24} md={16}>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <Tabs activeKey={activeTab} onChange={handleTabChange} items={items} className="p-4" />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ProfileComponent;

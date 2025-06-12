import { useState, useEffect } from "react";
import {
  Form,
  Input,
  Upload,
  Select,
  Switch,
  Button,
  Card,
  Row,
  Col,
  Tabs,
  Space,
  Typography,
  Divider,
  message,
  Spin,
  Alert,
} from "antd";
import {
  PlusOutlined,
  BankOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  CodeOutlined,
  FileImageOutlined,
  HomeOutlined,
  TeamOutlined,
  CustomerServiceOutlined,
  ToolOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { 
  useGetBranchesQuery,
  useUpdateBranchMutation 
} from "../../Slices/SuperAdmin/SuperAdminAPIs.js";
import { useNavigate, useParams } from "react-router-dom";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const EditBranch = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState("1");
  const [fileList, setFileList] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [initialData, setInitialData] = useState(null);

  // RTK Query hooks
  const { 
    data: apiData, 
    isLoading: isLoadingBranch, 
    isError: isErrorBranch,
    error: branchError 
  } = useGetBranchesQuery();

  const [updateBranch, { isLoading: isUpdating }] = useUpdateBranchMutation();

  // Find the specific branch from the branches list
  const currentBranch = apiData?.branch?.find(branch => branch._id === id);

  // Load branch data into form when data is fetched
  useEffect(() => {
    if (currentBranch) {
      const branch = currentBranch;
      setInitialData(branch);

      // Set form values
      const formValues = {
        name: branch.name,
        branchCode: branch.branchCode,
        isActive: Boolean(branch.isActive), // Ensure it's a proper boolean
        description: branch.description || "",
        location: {
          street: branch.location?.street || "",
          city: branch.location?.city || "",
          state: branch.location?.state || "",
          country: branch.location?.country || "",
          postalCode: branch.location?.postalCode || "",
          branch_phoneno: branch.location?.branch_phoneno || "",
          branch_email: branch.location?.branch_email || "",
        },
        content: {
          homepage: {
            title: branch.content?.homepage?.title || "Welcome to Our Branch",
            description: branch.content?.homepage?.description || "",
            content: branch.content?.homepage?.content || "",
          },
          aboutus: {
            title: branch.content?.aboutus?.title || "About Our Branch",
            mission: branch.content?.aboutus?.mission || "",
            vision: branch.content?.aboutus?.vision || "",
            history: branch.content?.aboutus?.history || "",
          },
          contactus: {
            title: branch.content?.contactus?.title || "Contact Us",
            description: branch.content?.contactus?.description || "",
            businessHours: branch.content?.contactus?.businessHours || "",
            additionalInfo: branch.content?.contactus?.additionalInfo || "",
          },
          services: {
            title: branch.content?.services?.title || "Our Services",
            description: branch.content?.services?.description || "",
            mainServices: branch.content?.services?.mainServices || "",
            specialties: branch.content?.services?.specialties || "",
          },
        },
      };

      form.setFieldsValue(formValues);

      // Set existing image if available
      if (branch.brand_logo) {
        setFileList([
          {
            uid: '-1',
            name: 'Current Logo',
            status: 'done',
            url: `https://res.cloudinary.com/dj0rho12o/image/upload/${branch.brand_logo}`,
          },
        ]);
      }
    }
  }, [currentBranch, form]);

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);

    if (newFileList.length > 0) {
      const file = newFileList[0].originFileObj || newFileList[0];

      // If it's the existing image (has url but no originFileObj), don't validate
      if (!file || file.url) {
        return;
      }

      // Validate file type
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        message.error("Only JPEG, JPG, and PNG files are allowed!");
        setFileList([]);
        setImageFile(null);
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        message.error("File size should not exceed 5MB!");
        setFileList([]);
        setImageFile(null);
        return;
      }

      // Store the actual file object for FormData
      setImageFile(file);
    } else {
      setImageFile(null);
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload Logo</div>
    </div>
  );

  const onFinish = async (values) => {
    try {
      console.log("Form values:", values);
      console.log("isActive value:", values.isActive, "Type:", typeof values.isActive);

      // Create FormData for multipart/form-data submission
      const formData = new FormData();

      // Add basic fields
      formData.append("name", values.name);
      formData.append("branchCode", values.branchCode);
      // Explicitly convert boolean to string for FormData
      formData.append("isActive", values.isActive ? "true" : "false");
      formData.append("description", values.description || "");

      // Add location fields
      if (values.location) {
        Object.keys(values.location).forEach((key) => {
          if (values.location[key]) {
            formData.append(`location[${key}]`, values.location[key]);
          }
        });
      }

      // Add content fields
      if (values.content) {
        Object.keys(values.content).forEach((section) => {
          if (values.content[section]) {
            Object.keys(values.content[section]).forEach((field) => {
              if (values.content[section][field]) {
                formData.append(
                  `content[${section}][${field}]`,
                  values.content[section][field]
                );
              }
            });
          }
        });
      }

      // Add the image file if a new one is selected
      if (imageFile) {
        formData.append("branch_image", imageFile);
      }

      // Log FormData contents for debugging
      console.log("FormData contents:");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      const result = await updateBranch({ id, formData }).unwrap();

      console.log("Branch updated successfully:", result);
      message.success("Branch updated successfully!");

      navigate("/superadmin/branches");
    } catch (error) {
      console.error("Error updating branch:", error);
      message.error(
        error?.data?.message ||
          error?.message ||
          "Failed to update branch. Please try again."
      );
    }
  };



  const tabItems = [
    {
      key: "1",
      label: (
        <span>
          <HomeOutlined />
          Home Page
        </span>
      ),
      children: (
        <Card>
          <Form.Item
            name={["content", "homepage", "title"]}
            label="Page Title"
            rules={[{ required: true, message: "Please enter page title" }]}
          >
            <Input placeholder="Enter home page title" />
          </Form.Item>
          <Form.Item
            name={["content", "homepage", "description"]}
            label="Page Description"
          >
            <TextArea rows={4} placeholder="Enter home page description" />
          </Form.Item>
          <Form.Item
            name={["content", "homepage", "content"]}
            label="Main Content"
          >
            <TextArea rows={6} placeholder="Enter main content for home page" />
          </Form.Item>
        </Card>
      ),
    },
    {
      key: "2",
      label: (
        <span>
          <TeamOutlined />
          About Us
        </span>
      ),
      children: (
        <Card>
          <Form.Item
            name={["content", "aboutus", "title"]}
            label="Page Title"
            rules={[{ required: true, message: "Please enter page title" }]}
          >
            <Input placeholder="Enter about us title" />
          </Form.Item>
          <Form.Item
            name={["content", "aboutus", "mission"]}
            label="Mission Statement"
          >
            <TextArea rows={3} placeholder="Enter mission statement" />
          </Form.Item>
          <Form.Item
            name={["content", "aboutus", "vision"]}
            label="Vision Statement"
          >
            <TextArea rows={3} placeholder="Enter vision statement" />
          </Form.Item>
          <Form.Item
            name={["content", "aboutus", "history"]}
            label="Branch History"
          >
            <TextArea rows={4} placeholder="Enter branch history" />
          </Form.Item>
        </Card>
      ),
    },
    {
      key: "3",
      label: (
        <span>
          <CustomerServiceOutlined />
          Contact Us
        </span>
      ),
      children: (
        <Card>
          <Form.Item
            name={["content", "contactus", "title"]}
            label="Page Title"
            rules={[{ required: true, message: "Please enter page title" }]}
          >
            <Input placeholder="Enter contact us title" />
          </Form.Item>
          <Form.Item
            name={["content", "contactus", "description"]}
            label="Contact Description"
          >
            <TextArea rows={3} placeholder="Enter contact description" />
          </Form.Item>
          <Form.Item
            name={["content", "contactus", "businessHours"]}
            label="Business Hours"
          >
            <TextArea rows={2} placeholder="Enter business hours" />
          </Form.Item>
          <Form.Item
            name={["content", "contactus", "additionalInfo"]}
            label="Additional Information"
          >
            <TextArea
              rows={3}
              placeholder="Enter additional contact information"
            />
          </Form.Item>
        </Card>
      ),
    },
    {
      key: "4",
      label: (
        <span>
          <ToolOutlined />
          Services
        </span>
      ),
      children: (
        <Card>
          <Form.Item
            name={["content", "services", "title"]}
            label="Page Title"
            rules={[{ required: true, message: "Please enter page title" }]}
          >
            <Input placeholder="Enter services title" />
          </Form.Item>
          <Form.Item
            name={["content", "services", "description"]}
            label="Services Overview"
          >
            <TextArea rows={3} placeholder="Enter services overview" />
          </Form.Item>
          <Form.Item
            name={["content", "services", "mainServices"]}
            label="Main Services"
          >
            <TextArea rows={4} placeholder="List your main services" />
          </Form.Item>
          <Form.Item
            name={["content", "services", "specialties"]}
            label="Specialties"
          >
            <TextArea rows={3} placeholder="Enter branch specialties" />
          </Form.Item>
        </Card>
      ),
    },
  ];

  // Loading state
  if (isLoadingBranch) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" tip="Loading branch data..." />
      </div>
    );
  }

  // Error state
  if (isErrorBranch) {
    return (
      <div style={{ padding: "24px" }}>
        <Alert
          message="Error Loading Branch"
          description={
            branchError?.message || "Failed to load branch data. Please try again."
          }
          type="error"
          showIcon
          action={
            <Button size="small" onClick={() => navigate("/superadmin/branches")}>
              Back to Branches
            </Button>
          }
        />
      </div>
    );
  }

  // If branches are loaded but current branch not found
  if (apiData && !currentBranch) {
    return (
      <div style={{ padding: "24px" }}>
        <Alert
          message="Branch Not Found"
          description="The requested branch could not be found."
          type="warning"
          showIcon
          action={
            <Button size="small" onClick={() => navigate("/superadmin/branches")}>
              Back to Branches
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <EditOutlined
          style={{ fontSize: "48px", color: "#da2c46", marginBottom: "16px" }}
        />
        <Title level={1} style={{ margin: 0, color: "#da2c46" }}>
          Edit Branch
        </Title>
        <Text type="secondary" style={{ fontSize: "16px" }}>
          Update branch information and configuration
        </Text>
        {initialData && (
          <div style={{ marginTop: "8px" }}>
            <Text strong style={{ color: "#da2c46" }}>
              {initialData.name} ({initialData.branchCode})
            </Text>
          </div>
        )}
      </div>

      <Spin spinning={isUpdating} tip="Updating branch...">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          {/* Basic Information Section */}
          <Card
            title={
              <span>
                <BankOutlined style={{ marginRight: 8 }} />
                Basic Information
              </span>
            }
            style={{ marginBottom: "24px" }}
          >
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="name"
                  label="Branch Name"
                  rules={[
                    { required: true, message: "Please enter branch name" },
                  ]}
                >
                  <Input
                    prefix={<BankOutlined />}
                    placeholder="Enter branch name"
                    size="large"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="branchCode"
                  label="Branch Code"
                  rules={[
                    { required: true, message: "Please enter branch code" },
                  ]}
                >
                  <Input
                    prefix={<CodeOutlined />}
                    placeholder="Enter branch code"
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col xs={24} md={12}>
                <div style={{ marginBottom: 24 }}>
                  <Text strong style={{ display: "block", marginBottom: 8 }}>
                    Branch Logo
                  </Text>
                  <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onChange={handleUploadChange}
                    beforeUpload={() => false} // Prevent automatic upload
                    maxCount={1}
                    accept="image/*"
                  >
                    {fileList.length >= 1 ? null : uploadButton}
                  </Upload>
                  {imageFile && (
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      New image ready for upload: {imageFile.name} (
                      {(imageFile.size / 1024).toFixed(2)} KB)
                    </Text>
                  )}
                </div>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="isActive"
                  label="Activity Status"
                  valuePropName="checked"
                >
                  <Switch size="large" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="description" label="Description">
              <TextArea rows={4} placeholder="Enter Branch description" />
            </Form.Item>
          </Card>

          {/* Location Information Section */}
          <Card
            title={
              <span>
                <EnvironmentOutlined style={{ marginRight: 8 }} />
                Location Information
              </span>
            }
            style={{ marginBottom: "24px" }}
          >
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name={["location", "street"]}
                  label="Street Address"
                  rules={[
                    { required: true, message: "Please enter street address" },
                  ]}
                >
                  <Input placeholder="Enter street address" size="large" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name={["location", "city"]}
                  label="City"
                  rules={[{ required: true, message: "Please enter city" }]}
                >
                  <Input placeholder="Enter city" size="large" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name={["location", "state"]}
                  label="State"
                  rules={[{ required: true, message: "Please enter state" }]}
                >
                  <Input placeholder="Enter state" size="large" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name={["location", "country"]}
                  label="Country"
                  rules={[{ required: true, message: "Please enter country" }]}
                >
                  <Input placeholder="Enter country" size="large" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name={["location", "postalCode"]}
                  label="Postal Code"
                  rules={[
                    { required: true, message: "Please enter postal code" },
                  ]}
                >
                  <Input placeholder="Enter postal code" size="large" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name={["location", "branch_phoneno"]}
                  label="Branch Phone"
                  rules={[
                    { required: true, message: "Please enter branch phone" },
                  ]}
                >
                  <Input
                    prefix={<PhoneOutlined />}
                    placeholder="Enter branch phone"
                    size="large"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name={["location", "branch_email"]}
                  label="Branch Email"
                  rules={[
                    { required: true, message: "Please enter branch email" },
                    { type: "email", message: "Please enter valid email" },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined />}
                    placeholder="Enter branch email"
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* Dynamic Content Tabs */}
          <Card
            title="Website Content Management"
            style={{ marginBottom: "24px" }}
          >
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={tabItems}
              size="large"
            />
          </Card>

          {/* Action Buttons */}
          <div style={{ textAlign: "center", paddingTop: "24px" }}>
            <Space size="large">
              <Button
                size="large"
                onClick={() => navigate("/superadmin/branches")}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={isUpdating}
                disabled={isUpdating}
                style={{
                  minWidth: "150px",
                  background:
                    "linear-gradient(135deg,  #da2c46 70%, #a51632 100%)",
                  border: "none",
                }}
              >
                {isUpdating ? "Updating..." : "Update Branch"}
              </Button>
            </Space>
          </div>
        </Form>
      </Spin>
    </div>
  );
};

export default EditBranch;
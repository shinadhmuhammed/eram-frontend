import { useState } from "react";
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
} from "@ant-design/icons";
import { useCreateBranchMutation } from "../../Slices/SuperAdmin/SuperAdminApis.js";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const AddBranch = () => {
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState("1");
  const [fileList, setFileList] = useState([]);
  const [imageFile, setImageFile] = useState(null); // Store the actual file object

  // RTK mutation hook
  const [createBranch, { isLoading, isError, error }] =
    useCreateBranchMutation();

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);

    if (newFileList.length > 0) {
      const file = newFileList[0].originFileObj || newFileList[0];

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

      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("branchCode", values.branchCode);
      formData.append("isActive", values.isActive);
      formData.append("description", values.description || "");

      if (values.location) {
        Object.keys(values.location).forEach((key) => {
          if (values.location[key]) {
            formData.append(`location[${key}]`, values.location[key]);
          }
        });
      }

      if (imageFile) {
        formData.append("branch_image", imageFile);
      }

      console.log("FormData contents:");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      const result = await createBranch(formData).unwrap();

      console.log("Branch created successfully:", result);
      message.success("Branch created successfully!");

      form.resetFields();
      navigate("/superadmin/branches");
      setFileList([]);
      setImageFile(null);
    } catch (error) {
      console.error("Error creating branch:", error);
      message.error(
        error?.data?.message ||
          error?.message ||
          "Failed to create branch. Please try again."
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

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <BankOutlined
          style={{ fontSize: "48px", color: '#da2c46', marginBottom: "16px" }}
        />
        <Title level={1} style={{ margin: 0, color: '#da2c46' }}>
          Add New Branch
        </Title>
        <Text type="secondary" style={{ fontSize: "16px" }}>
          Create and configure your new branch location
        </Text>
      </div>

      <Spin spinning={isLoading} tip="Creating branch...">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            isActive: true,
            content: {
              homepage: { title: "Welcome to Our Branch" },
              aboutus: { title: "About Our Branch" },
              contactus: { title: "Contact Us" },
              services: { title: "Our Services" },
            },
          }}
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
                      Image ready for upload: {imageFile.name} (
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
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Switch size="large" />
                    <Text>Active</Text>
                  </div>
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
                onClick={() => {
                  navigate("/superadmin/branches");
                  form.resetFields();
                  setFileList([]);
                  setImageFile(null);
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={isLoading}
                disabled={isLoading}
                style={{
                  minWidth: "150px",
                  background:
                    "linear-gradient(135deg,  #da2c46 70%, #a51632 100%)",
                  border: "none",
                }}
              >
                {isLoading ? "Creating..." : "Create Branch"}
              </Button>
            </Space>
          </div>
        </Form>
      </Spin>
    </div>
  );
};

export default AddBranch;

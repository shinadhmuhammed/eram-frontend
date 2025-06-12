import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack"; // Add this import
import { useLogoutSuperAdminMutation } from "../../Slices/SuperAdmin/SuperAdminApis.js";
import { userLogout } from "../../Slices/Users/UserSlice";

import { Layout, Avatar, Dropdown, Menu, Button, Badge } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  MenuOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
  BellOutlined,
  MailOutlined,
} from "@ant-design/icons";
import styled from "styled-components";

const { Header } = Layout;

const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1200,
  largeDesktop: 1600,
};

const AppBar = styled(Header)`
  background: #ffffff !important;
  padding: 0 ${(props) => props.padding}px;
  height: ${(props) => props.height}px;
  line-height: ${(props) => props.height}px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  position: fixed !important;
  top: 0;
  left: ${(props) => props.leftMargin}px !important;
  right: 0 !important;
  z-index: 99 !important;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e8e8e8;
  transition: all 0.3s ease;

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    padding: 0 12px;
    height: 56px;
    line-height: 56px;
    left: 0 !important;
  }

  @media (min-width: ${BREAKPOINTS.mobile}px) and (max-width: ${BREAKPOINTS.tablet}px) {
    padding: 0 16px;
    height: 60px;
    line-height: 60px;
  }

  @media (min-width: ${BREAKPOINTS.largeDesktop}px) {
    padding: 0 32px;
    height: 68px;
    line-height: 68px;
  }
`;

const NavButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f7fafc !important;
    border-color: transparent !important;
  }

  &:focus {
    background-color: #f7fafc !important;
    border-color: transparent !important;
  }
`;

const UserInfoContainer = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #e8e8e8;
  background: #f8f9fa;
  margin: -8px -12px 8px -12px;
`;

const UserName = styled.div`
  font-weight: 600;
  color: #2a4365;
  font-size: 14px;
  margin-bottom: 2px;
`;

const UserEmail = styled.div`
  color: #64748b;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const AdminNavbar = ({ collapsed, setCollapsed, setDrawerVisible }) => {
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    isMobile: window.innerWidth < BREAKPOINTS.mobile,
    isTablet:
      window.innerWidth >= BREAKPOINTS.mobile &&
      window.innerWidth < BREAKPOINTS.tablet,
    isDesktop:
      window.innerWidth >= BREAKPOINTS.tablet &&
      window.innerWidth < BREAKPOINTS.largeDesktop,
    isLargeDesktop: window.innerWidth >= BREAKPOINTS.largeDesktop,
  });

  const [adminInfo, setAdminInfo] = useState({
    name: "Admin",
    email: "",
    roles: "",
  });

  const [logout] = useLogoutSuperAdminMutation();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fetch admin info from localStorage
  useEffect(() => {
    const fetchAdminInfo = () => {
      try {
        // Try to get admin info from different possible localStorage keys
        const adminData =
          localStorage.getItem('adminInfo') ||
          localStorage.getItem('superAdminInfo') ||
          localStorage.getItem('userInfo') ||
          localStorage.getItem('user');

        if (adminData) {
          const parsedData = JSON.parse(adminData);

          // Handle different data structures for name
          const name = parsedData.name ||
            parsedData.fullName ||
            parsedData.firstName ||
            parsedData.username ||
            "Admin";

          const email = parsedData.email || "";

          // Handle different data structures for roles
          const roles = parsedData.roles ||
            parsedData.role ||
            parsedData.userRole ||
            parsedData.position ||
            parsedData.designation ||
            (Array.isArray(parsedData.roles) ?
              parsedData.roles.join(", ") : "") ||
            "";

          setAdminInfo({
            name: name,
            email: email,
            roles: roles,
          });
        }
      } catch (error) {
        console.error("Error parsing admin info from localStorage:", error);
        // Keep default values if parsing fails
      }
    };

    fetchAdminInfo();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setScreenSize({
        width,
        isMobile: width < BREAKPOINTS.mobile,
        isTablet: width >= BREAKPOINTS.mobile && width < BREAKPOINTS.tablet,
        isDesktop:
          width >= BREAKPOINTS.tablet && width < BREAKPOINTS.largeDesktop,
        isLargeDesktop: width >= BREAKPOINTS.largeDesktop,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getNavbarHeight = () => {
    if (screenSize.isMobile) return 56;
    if (screenSize.isTablet) return 60;
    if (screenSize.isLargeDesktop) return 68;
    return 64;
  };

  const getPadding = () => {
    if (screenSize.isMobile) return 12;
    if (screenSize.isTablet) return 16;
    if (screenSize.isLargeDesktop) return 32;
    return 24;
  };

  const getIconSize = () => {
    if (screenSize.isMobile) return "16px";
    if (screenSize.isTablet) return "17px";
    return "18px";
  };

  const getButtonSize = () => {
    if (screenSize.isMobile) return 36;
    if (screenSize.isTablet) return 38;
    return 40;
  };

  const getAvatarSize = () => {
    if (screenSize.isMobile) return 32;
    if (screenSize.isTablet) return 36;
    return 40;
  };

  const getNavbarLeftMargin = () => {
    if (screenSize.isMobile) return 0;

    const sidebarWidth = screenSize.isTablet ? 220 : 250;
    const collapsedWidth = screenSize.isTablet ? 70 : 80;

    return collapsed ? collapsedWidth : sidebarWidth;
  };

  const getToggleIcon = () => {
    const iconStyle = {
      fontSize: getIconSize(),
      color: "#2a4365",
    };

    if (screenSize.isMobile) {
      return <MenuOutlined style={iconStyle} />;
    }

    return collapsed ? (
      <DoubleRightOutlined style={iconStyle} />
    ) : (
      <DoubleLeftOutlined style={iconStyle} />
    );
  };

  const toggleSidebar = () => {
    if (screenSize.isMobile) {
      setDrawerVisible(true);
    } else {
      setCollapsed(!collapsed);
    }
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(userLogout({ role: "admin" }));

      enqueueSnackbar("Logged out successfully", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "right" },
        autoHideDuration: 3000,
      });

      navigate("/login");

    } catch (error) {
      console.error("Logout failed:", error);

      enqueueSnackbar(error?.data?.message || error?.message || "Logout failed. Please try again.", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
        autoHideDuration: 3000,
      });
    }
  };

  const getFirstLetter = () => {
    return adminInfo.name.charAt(0).toUpperCase();
  };

  const userMenuItems = [
    {
      key: "user-info",
      label: (
        <UserInfoContainer>
          <UserName>{adminInfo.name}</UserName>
          {adminInfo.roles && (
            <div style={{
              color: "#64748b",
              fontSize: "11px",
              marginTop: "4px",
              fontWeight: "500"
            }}>
              {adminInfo.roles}
            </div>
          )}
          {adminInfo.email && (
            <UserEmail>
              <MailOutlined style={{ fontSize: "12px" }} />
              {adminInfo.email}
            </UserEmail>
          )}

        </UserInfoContainer>
      ),
      disabled: true,
    },
    {
      key: "profile",
      icon: <UserOutlined style={{ color: "#2a4365" }} />,
      label: "Profile",
      onClick: () => navigate("/superadmin/settings"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined style={{ color: "#ff4d4f" }} />,
      label: <span style={{ color: "#ff4d4f" }}>Logout</span>,
      onClick: () => handleLogout(),
    },
  ];

  return (
    <AppBar
      height={getNavbarHeight()}
      padding={getPadding()}
      leftMargin={getNavbarLeftMargin()}
    >
      <NavButton
        type="text"
        icon={getToggleIcon()}
        onClick={toggleSidebar}
        style={{
          marginRight: screenSize.isMobile ? "8px" : "16px",
          width: getButtonSize(),
          height: getButtonSize(),
        }}
      />

      {!screenSize.isMobile && (
        <div
          style={{
            fontSize: screenSize.isTablet ? "16px" : "18px",
            fontWeight: 600,
            color: "#2a4365",
            marginRight: "auto",
          }}
        >        </div>
      )}

      <div style={{ flex: 1 }} />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: screenSize.isMobile ? "8px" : "12px",
        }}
      >
        <Badge count={5} size="small">
          <NavButton
            type="text"
            icon={
              <BellOutlined
                style={{
                  color: "#2a4365",
                  fontSize: getIconSize(),
                }}
              />
            }
            style={{
              width: getButtonSize(),
              height: getButtonSize(),
            }}
          />
        </Badge>

        <Dropdown
          menu={{
            items: userMenuItems,
          }}
          placement="bottomRight"
          trigger={["click"]}
          arrow={!screenSize.isMobile}
        >
          <Avatar
            size={getAvatarSize()}
            style={{
              backgroundColor: "#2c5282",
              cursor: "pointer",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
              fontWeight: "600",
            }}
          >
            {adminInfo.name ? getFirstLetter() : <UserOutlined />}
          </Avatar>
        </Dropdown>
      </div>
    </AppBar>
  );
};

export default AdminNavbar;
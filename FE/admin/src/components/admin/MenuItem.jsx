import { BookOutlined, DashboardOutlined, GiftOutlined, ProfileOutlined, SolutionOutlined, TrophyOutlined, UserOutlined } from "@ant-design/icons";

export const items = [
    {key: "profile", icon: <ProfileOutlined />, label:"Profile"},
    { key: "dashboard", icon: <DashboardOutlined />, label: "Dashboard", type: "Dashboard" },
    { key: "users", icon: <UserOutlined />, label: "User Management", type: "User" },
    { key: "courses", icon: <BookOutlined />, label: "Course Management", type: "Course" },
    { key: "coupons", icon: <GiftOutlined />, label: "Coupon Management", type: "Coupon" },
    { key: "withdraws", icon: <TrophyOutlined />, label: "Withdraw Management", type: "Withdraw" },
    { key: "studies", icon: <SolutionOutlined />, label: "Study Management", type: "Study" },
];

import { BookOutlined, DashboardOutlined, GiftOutlined, SolutionOutlined, TrophyOutlined, UserOutlined } from "@ant-design/icons";

export const items = [
    { key: "/admin/dashboard", icon: <DashboardOutlined />, label: "Dashboard", type: "Dashboard" },
    { key: "/admin/users", icon: <UserOutlined />, label: "User Management", type: "User" },
    { key: "/admin/courses", icon: <BookOutlined />, label: "Course Management", type: "Course" },
    { key: "/admin/coupons", icon: <GiftOutlined />, label: "Coupon Management", type: "Coupon" },
    { key: "/admin/achievements", icon: <TrophyOutlined />, label: "Achievement Management", type: "Achievement" },
    { key: "/admin/studies", icon: <SolutionOutlined />, label: "Study Management", type: "Study" },
];

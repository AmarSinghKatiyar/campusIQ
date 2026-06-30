import { COLORS } from "../constants/colors";

export const topStudents = [
  { rank: 1, name: "Priya Sharma", branch: "Computer Science", cgpa: 9.8, score: 97, badge: "Exceptional" },
  { rank: 2, name: "Arjun Mehta", branch: "Electronics", cgpa: 9.6, score: 95, badge: "Outstanding" },
  { rank: 3, name: "Sneha Iyer", branch: "Information Tech.", cgpa: 9.5, score: 93, badge: "Outstanding" },
  { rank: 4, name: "Rahul Verma", branch: "Mechanical Eng.", cgpa: 9.3, score: 91, badge: "Excellent" },
  { rank: 5, name: "Kavya Nair", branch: "Computer Science", cgpa: 9.2, score: 89, badge: "Excellent" },
  { rank: 6, name: "Dev Patel", branch: "Civil Eng.", cgpa: 9.1, score: 87, badge: "Good" },
  { rank: 7, name: "Ananya Singh", branch: "Information Tech.", cgpa: 9.0, score: 86, badge: "Good" },
  { rank: 8, name: "Karan Joshi", branch: "Electronics", cgpa: 8.9, score: 84, badge: "Good" },
];

export const performanceData = [
  { month: "Jan", score: 72, placements: 8 },
  { month: "Feb", score: 75, placements: 12 },
  { month: "Mar", score: 78, placements: 15 },
  { month: "Apr", score: 74, placements: 10 },
  { month: "May", score: 82, placements: 22 },
  { month: "Jun", score: 85, placements: 28 },
  { month: "Jul", score: 88, placements: 31 },
  { month: "Aug", score: 87, placements: 29 },
  { month: "Sep", score: 91, placements: 38 },
  { month: "Oct", score: 89, placements: 35 },
  { month: "Nov", score: 93, placements: 42 },
  { month: "Dec", score: 96, placements: 48 },
];

export const branchData = [
  { name: "Computer Science", value: 38, color: COLORS.INDIGO },
  { name: "Electronics", value: 24, color: COLORS.EMERALD },
  { name: "Information Tech.", value: 18, color: COLORS.PURPLE },
  { name: "Mechanical", value: 12, color: COLORS.AMBER },
  { name: "Civil", value: 8, color: COLORS.PINK },
];

export const recentActivities = [
  { text: "Priya Sharma completed profile update", time: "2 min ago", type: "profile" },
  { text: "TCS recruitment drive registered — 45 students applied", time: "18 min ago", type: "drive" },
  { text: "New AI scores generated for Batch 2025", time: "1 hr ago", type: "ai" },
  { text: "12 new students registered via student portal", time: "2 hr ago", type: "register" },
  { text: "Infosys interview results uploaded successfully", time: "4 hr ago", type: "result" },
  { text: "Wipro drive scheduled for Dec 28, 2025", time: "6 hr ago", type: "drive" },
];

export const navItems = [
  { id: "dashboard", label: "Dashboard" },
  { id: "students", label: "Students" },
  { id: "rankings", label: "Rankings" },
  { id: "placements", label: "Placements" },
  { id: "reports", label: "Reports" },
  { id: "settings", label: "Settings" },
];

export const notificationsList = [
  { text: "TCS drive approved for Jan 15, 2025", time: "5 min ago" },
  { text: "25 students completed AI assessment", time: "1 hr ago" },
  { text: "Monthly placement report is ready", time: "3 hr ago" },
];

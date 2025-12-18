
// import React from "react";
// import DashboardLayout from "./DashboardLayout";
// import {
//   Tabs,
//   Card,
//   Row,
//   Col,
//   Statistic,
//   Table,
//   Tag,
//   Typography,
//   Button,
//   Space,
// } from "antd";
// import {
//   ArrowUpOutlined,
//   ArrowDownOutlined,
//   UserOutlined,
//   CarOutlined,
//   InboxOutlined,
// } from "@ant-design/icons";
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
// import UserManagement from "./UserManager";

// const { Title } = Typography;

// const AdminDashboard = () => {
//   // Giả lập dữ liệu thống kê
//   const stats = [
//     {
//       title: "Tổng số lô hàng",
//       value: 120,
//       prefix: <InboxOutlined />,
//       color: "#1890ff",
//       change: "+12%",
//     },
//     {
//       title: "Người dùng hoạt động",
//       value: 36,
//       prefix: <UserOutlined />,
//       color: "#52c41a",
//       change: "+8%",
//     },
//     {
//       title: "Đang vận chuyển",
//       value: 15,
//       prefix: <CarOutlined />,
//       color: "#faad14",
//       change: "-3%",
//     },
//   ];

//   const recentShipments = [
//     {
//       seafoodId: "S001",
//       species: "Tôm sú",
//       status: "Đang đánh bắt",
//       origin: "Cà Mau",
//       date: "2025-10-28",
//     },
//     {
//       seafoodId: "S002",
//       species: "Cá ngừ đại dương",
//       status: "Đã chế biến",
//       origin: "Phú Yên",
//       date: "2025-10-29",
//     },
//     {
//       seafoodId: "S003",
//       species: "Mực lá",
//       status: "Đang vận chuyển",
//       origin: "Nha Trang",
//       date: "2025-10-30",
//     },
//   ];

//   const statusColor = (status) => {
//     switch (status) {
//       case "Đã chế biến":
//         return "green";
//       case "Đang vận chuyển":
//         return "blue";
//       default:
//         return "orange";
//     }
//   };

//   const columns = [
//     { title: "Mã lô hàng", dataIndex: "seafoodId" },
//     { title: "Loại hải sản", dataIndex: "species" },
//     { title: "Nguồn gốc", dataIndex: "origin" },
//     {
//       title: "Trạng thái",
//       dataIndex: "status",
//       render: (text) => <Tag color={statusColor(text)}>{text}</Tag>,
//     },
//     { title: "Ngày cập nhật", dataIndex: "date" },
//     {
//       title: "Hành động",
//       render: (_, record) => (
//         <Space>
//           <Button type="link">Xem</Button>
//           <Button type="link" danger>
//             Xóa
//           </Button>
//         </Space>
//       ),
//     },
//   ];

//   // Dữ liệu cho biểu đồ
//   const barData = [
//     { name: "Đánh bắt", value: 30 },
//     { name: "Chế biến", value: 45 },
//     { name: "Vận chuyển", value: 20 },
//     { name: "Phân phối", value: 25 },
//   ];

//   const pieData = [
//     { name: "Tôm sú", value: 35 },
//     { name: "Cá ngừ", value: 25 },
//     { name: "Mực lá", value: 20 },
//     { name: "Khác", value: 20 },
//   ];

//   const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

//   const dashboardContent = (
//     <>
//       {/* THỐNG KÊ */}
//       <Row gutter={[16, 16]}>
//         {stats.map((item, i) => (
//           <Col span={8} key={i}>
//             <Card>
//               <Statistic
//                 title={item.title}
//                 value={item.value}
//                 prefix={item.prefix}
//                 valueStyle={{ color: item.color }}
//               />
//               <div style={{ marginTop: 8, color: item.change.startsWith("+") ? "green" : "red" }}>
//                 {item.change.startsWith("+") ? (
//                   <ArrowUpOutlined />
//                 ) : (
//                   <ArrowDownOutlined />
//                 )}{" "}
//                 {item.change}
//               </div>
//             </Card>
//           </Col>
//         ))}
//       </Row>

//       {/* BIỂU ĐỒ */}
//       <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
//         <Col span={12}>
//           <Card title="Phân bố theo giai đoạn">
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={barData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="value" fill="#1890ff" />
//               </BarChart>
//             </ResponsiveContainer>
//           </Card>
//         </Col>
//         <Col span={12}>
//           <Card title="Tỷ lệ loại hải sản">
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={pieData}
//                   dataKey="value"
//                   nameKey="name"
//                   outerRadius={100}
//                   fill="#8884d8"
//                   label
//                 >
//                   {pieData.map((_, index) => (
//                     <Cell key={index} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           </Card>
//         </Col>
//       </Row>

//       {/* BẢNG LÔ HÀNG */}
//       <Card title="Danh sách lô hàng gần đây" style={{ marginTop: 24 }}>
//         <Table columns={columns} dataSource={recentShipments} pagination={false} />
//       </Card>
//     </>
//   );

//   return (
//     <DashboardLayout>
//       <Title level={3} style={{ marginBottom: 16 }}>
//         🧭 Bảng điều khiển quản trị
//       </Title>
//       <Tabs
//         defaultActiveKey="1"
//         items={[
//           { key: "1", label: "📊 Tổng quan", children: dashboardContent },
//           { key: "2", label: "👥 Quản lý người dùng", children: <UserManagement /> },
//           {
//             key: "3",
//             label: "🕒 Hoạt động gần đây",
//             children: (
//               <Card>
//                 <ul>
//                   <li>Ngư dân A vừa tạo lô hàng S001.</li>
//                   <li>Nhà chế biến B cập nhật trạng thái lô hàng S002.</li>
//                   <li>Đơn vị vận chuyển C đang vận chuyển lô hàng S003.</li>
//                 </ul>
//               </Card>
//             ),
//           },
//         ]}
//       />
//     </DashboardLayout>
//   );
// };

// export default AdminDashboard;



import React, { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";
import {
  Tabs,
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Typography,
  Button,
  Space,
  Spin,
  message,
} from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  UserOutlined,
  CarOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import axiosAdmin from "../../services/axiosAdmin";
import UserManagement from "./UserManager";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const { Title } = Typography;

const AdminDashboard = () => {
  const [seafoods, setSeafoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usersCount, setUsersCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [seafoodRes, userRes] = await Promise.all([
          axiosAdmin.get("/seafoods"),
          axiosAdmin.get("/users"),
        ]);
        setSeafoods(seafoodRes.data || []);
        setUsersCount(userRes.data.length || 0);
      } catch (err) {
        console.error(err);
        message.error("Không thể tải dữ liệu từ server!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ textAlign: "center", marginTop: 100 }}>
          <Spin size="large" />
        </div>
      </DashboardLayout>
    );
  }

  // Thống kê cơ bản
  const stats = [
    {
      title: "Tổng số lô hàng",
      value: seafoods.length,
      prefix: <InboxOutlined />,
      color: "#1890ff",
      change: "+12%",
    },
    {
      title: "Người dùng hoạt động",
      value: usersCount,
      prefix: <UserOutlined />,
      color: "#52c41a",
      change: "+8%",
    },
    {
      title: "Đang vận chuyển",
      value: seafoods.filter((s) => s.status === "Đang vận chuyển").length,
      prefix: <CarOutlined />,
      color: "#faad14",
      change: "-3%",
    },
  ];

  const statusColor = (status) => {
    switch (status) {
      case "Đã chế biến":
        return "green";
      case "Đang vận chuyển":
        return "blue";
      case "Hoàn thành":
        return "gray";
      default:
        return "orange";
    }
  };

  const columns = [
    { title: "Mã lô hàng", dataIndex: "seafoodId" },
    { title: "Loại hải sản", dataIndex: "species" },
    { title: "Nguồn gốc", dataIndex: "origin" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (text) => <Tag color={statusColor(text)}>{text}</Tag>,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <Space>
          <Button type="link">Xem</Button>
          <Button type="link" danger>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const barData = [
    { name: "Đánh bắt", value: seafoods.filter((s) => s.status === "Đang đánh bắt").length },
    { name: "Chế biến", value: seafoods.filter((s) => s.status === "Đã chế biến").length },
    { name: "Vận chuyển", value: seafoods.filter((s) => s.status === "Đang vận chuyển").length },
    { name: "Hoàn thành", value: seafoods.filter((s) => s.status === "Hoàn thành").length },
  ];

  const pieData = [
    ...Object.entries(
      seafoods.reduce((acc, s) => {
        acc[s.species] = (acc[s.species] || 0) + 1;
        return acc;
      }, {})
    ).map(([name, value]) => ({ name, value })),
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const dashboardContent = (
    <>
      <Row gutter={[16, 16]}>
        {stats.map((item, i) => (
          <Col span={8} key={i}>
            <Card>
              <Statistic
                title={item.title}
                value={item.value}
                prefix={item.prefix}
                valueStyle={{ color: item.color }}
              />
              <div
                style={{
                  marginTop: 8,
                  color: item.change.startsWith("+") ? "green" : "red",
                }}
              >
                {item.change.startsWith("+") ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )}{" "}
                {item.change}
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Biểu đồ */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={12}>
          <Card title="Phân bố theo giai đoạn">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#1890ff" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Tỷ lệ loại hải sản">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {pieData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Card title="Danh sách lô hàng" style={{ marginTop: 24 }}>
        <Table
          columns={columns}
          dataSource={seafoods.map((item) => ({ ...item, key: item.id }))}
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </>
  );

  return (
    <DashboardLayout role="Admin">
      <Title level={3} style={{ marginBottom: 16 }}>
        🧭 Bảng điều khiển quản trị
      </Title>
      <Tabs
        defaultActiveKey="1"
        items={[
          { key: "1", label: "📊 Tổng quan", children: dashboardContent },
          { key: "2", label: "👥 Quản lý người dùng", children: <UserManagement /> },
        ]}
      />
    </DashboardLayout>
  );
};

export default AdminDashboard;

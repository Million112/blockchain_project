// // src/pages/Fisherman/Dashboard.jsx
// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import {
//   Layout,
//   Typography,
//   Button,
//   Card,
//   Form,
//   Input,
//   Row,
//   Col,
//   Table,
//   Tag,
//   message,
// } from "antd";
// import { PlusOutlined, LogoutOutlined } from "@ant-design/icons";
// import api from "../../api/client";
// import { useAuth } from "../../context/useAuth";

// const { Header, Content } = Layout;
// const { Title, Text } = Typography;

// export default function FishermanDashboard() {
//   const { username, logout } = useAuth();
//   const [form] = Form.useForm();
//   const [catches, setCatches] = useState([]);
//   const [loadingList, setLoadingList] = useState(false);
//   const [creating, setCreating] = useState(false);

//   const loadMyCatches = async () => {
//     setLoadingList(true);
//     try {
//       const res = await api.get("/fisherman/my-catches");
//       setCatches(res.data || []);
//     } catch (err) {
//       console.error(err);
//       message.error("Không tải được danh sách lô hàng");
//     } finally {
//       setLoadingList(false);
//     }
//   };

//   useEffect(() => {
//     loadMyCatches();
//   }, []);

//   const onCreate = async (values) => {
//     setCreating(true);
//     try {
//       await api.post("/fisherman/create", values);
//       message.success("Tạo lô mới thành công");
//       form.resetFields();
//       loadMyCatches();
//     } catch (err) {
//       console.error(err);
//       message.error(
//         err.response?.data?.error || "Tạo lô thất bại, vui lòng kiểm tra lại"
//       );
//     } finally {
//       setCreating(false);
//     }
//   };

//   const columns = [
//     {
//       title: "Mã lô",
//       dataIndex: "seafoodId",
//       key: "seafoodId",
//     },
//     {
//       title: "Loài",
//       dataIndex: "species",
//       key: "species",
//     },
//     {
//       title: "Nguồn gốc",
//       dataIndex: "origin",
//       key: "origin",
//     },
//     {
//       title: "Trạng thái",
//       dataIndex: "status",
//       key: "status",
//       render: (status) => <Tag color="blue">{status}</Tag>,
//     },
//     {
//       title: "Chủ sở hữu",
//       dataIndex: "ownerId",
//       key: "ownerId",
//       render: (owner) => owner || <Text type="secondary">Chưa gán</Text>,
//     },
//     {
//       title: "Thao tác",
//       key: "actions",
//       render: (_, record) => (
//         <Link to={`/fisherman/catches/${record.seafoodId}`}>Xem chi tiết</Link>
//       ),
//     },
//   ];

//   return (
//     <Layout style={{ minHeight: "100vh" }}>
//       <Header
//         style={{
//           background: "#0f766e",
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           paddingInline: 24,
//         }}
//       >
//         <div>
//           <Title level={4} style={{ color: "#fff", margin: 0 }}>
//             Ngư dân - Quản lý lô thủy sản
//           </Title>
//           <Text style={{ color: "#d1fae5" }}>Xin chào, {username}</Text>
//         </div>
//         <Button
//           type="primary"
//           danger
//           icon={<LogoutOutlined />}
//           onClick={logout}
//         >
//           Đăng xuất
//         </Button>
//       </Header>

//       <Content style={{ padding: 24, background: "#f3f4f6" }}>
//         <Row gutter={[16, 16]}>
//           <Col xs={24} lg={10}>
//             <Card
//               title="Tạo lô thủy sản mới"
//               extra={<PlusOutlined />}
//               bordered={false}
//             >
//               <Form
//                 layout="vertical"
//                 form={form}
//                 onFinish={onCreate}
//               >
//                 <Form.Item
//                   label="Mã lô (seafoodId)"
//                   name="seafoodId"
//                   rules={[{ required: true, message: "Vui lòng nhập mã lô" }]}
//                 >
//                   <Input placeholder="vd: S001" />
//                 </Form.Item>

//                 <Form.Item
//                   label="Loài (species)"
//                   name="species"
//                   rules={[{ required: true, message: "Vui lòng nhập loài" }]}
//                 >
//                   <Input placeholder="vd: Tôm sú" />
//                 </Form.Item>

//                 <Form.Item
//                   label="Nguồn gốc (origin)"
//                   name="origin"
//                   rules={[{ required: true, message: "Vui lòng nhập nguồn gốc" }]}
//                 >
//                   <Input placeholder="vd: Cà Mau" />
//                 </Form.Item>

//                 <Form.Item>
//                   <Button
//                     type="primary"
//                     htmlType="submit"
//                     loading={creating}
//                     block
//                   >
//                     Tạo lô
//                   </Button>
//                 </Form.Item>
//               </Form>
//             </Card>
//           </Col>

//           <Col xs={24} lg={14}>
//             <Card
//               title="Lô thủy sản của tôi"
//               bordered={false}
//             >
//               <Table
//                 rowKey="seafoodId"
//                 columns={columns}
//                 dataSource={catches}
//                 loading={loadingList}
//                 pagination={{ pageSize: 5 }}
//               />
//             </Card>
//           </Col>
//         </Row>
//       </Content>
//     </Layout>
//   );
// }



// src/pages/Fisherman/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Layout,
  Typography,
  Button,
  Card,
  Form,
  Input,
  Row,
  Col,
  Table,
  Tag,
  message,
  Modal,
  Space,
} from "antd";
import {
  PlusOutlined,
  LogoutOutlined,
  SwapRightOutlined,
} from "@ant-design/icons";
import api from "../../api/client";
import { useAuth } from "../../context/useAuth";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

export default function FishermanDashboard() {
  const { username, logout } = useAuth();
  const [form] = Form.useForm();
  const [catches, setCatches] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [creating, setCreating] = useState(false);

  // state cho Transfer modal
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [transferForm] = Form.useForm();
  const [selectedLot, setSelectedLot] = useState(null);

  const loadMyCatches = async () => {
    setLoadingList(true);
    try {
      const res = await api.get("/fisherman/my-catches");
      setCatches(res.data || []);
    } catch (err) {
      console.error(err);
      message.error("Không tải được danh sách lô hàng");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadMyCatches();
  }, []);

  const onCreate = async (values) => {
    setCreating(true);
    try {
      await api.post("/fisherman/create", values);
      message.success("Tạo lô mới thành công");
      form.resetFields();
      loadMyCatches();
    } catch (err) {
      console.error(err);
      message.error(
        err.response?.data?.error || "Tạo lô thất bại, vui lòng kiểm tra lại"
      );
    } finally {
      setCreating(false);
    }
  };

  // 👉 Gửi request TransferSeafood
  const onTransferSubmit = async (values) => {
    if (!selectedLot) return;
    try {
      await api.post(`/fisherman/transfer/${selectedLot.seafoodId}`, {
        newOwner: values.newOwner, // ví dụ: "processor1"
      });
      message.success("Chuyển lô cho đơn vị tiếp theo thành công");
      setTransferModalOpen(false);
      transferForm.resetFields();
      setSelectedLot(null);
      loadMyCatches(); // sau khi chuyển, lô này sẽ không còn trong danh sách của Fisherman nữa
    } catch (err) {
      console.error(err);
      message.error(
        err.response?.data?.error ||
          "Chuyển lô thất bại, vui lòng kiểm tra lại"
      );
    }
  };

  const columns = [
    {
      title: "Mã lô",
      dataIndex: "seafoodId",
      key: "seafoodId",
    },
    {
      title: "Loài",
      dataIndex: "species",
      key: "species",
    },
    {
      title: "Nguồn gốc",
      dataIndex: "origin",
      key: "origin",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color="blue">{status}</Tag>,
    },
    {
      title: "Chủ sở hữu",
      dataIndex: "ownerId",
      key: "ownerId",
      render: (owner) => owner || <Text type="secondary">Chưa gán</Text>,
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Link to={`/fisherman/catches/${record.seafoodId}`}>
            Xem chi tiết
          </Link>
          <Button
            size="small"
            icon={<SwapRightOutlined />}
            onClick={() => {
              setSelectedLot(record);
              transferForm.resetFields();
              setTransferModalOpen(true);
            }}
          >
            Chuyển chủ sở hữu
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          background: "#0f766e",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingInline: 24,
        }}
      >
        <div>
          <Title level={4} style={{ color: "#fff", margin: 0 }}>
            Ngư dân - Quản lý lô thủy sản
          </Title>
          <Text style={{ color: "#d1fae5" }}>Xin chào, {username}</Text>
        </div>
        <Button
          type="primary"
          danger
          icon={<LogoutOutlined />}
          onClick={logout}
        >
          Đăng xuất
        </Button>
      </Header>

      <Content style={{ padding: 24, background: "#f3f4f6" }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={10}>
            <Card
              title="Tạo lô thủy sản mới"
              extra={<PlusOutlined />}
              bordered={false}
            >
              <Form layout="vertical" form={form} onFinish={onCreate}>
                <Form.Item
                  label="Mã lô (seafoodId)"
                  name="seafoodId"
                  rules={[{ required: true, message: "Vui lòng nhập mã lô" }]}
                >
                  <Input placeholder="vd: S001" />
                </Form.Item>

                <Form.Item
                  label="Loài (species)"
                  name="species"
                  rules={[{ required: true, message: "Vui lòng nhập loài" }]}
                >
                  <Input placeholder="vd: Tôm sú" />
                </Form.Item>

                <Form.Item
                  label="Nguồn gốc (origin)"
                  name="origin"
                  rules={[
                    { required: true, message: "Vui lòng nhập nguồn gốc" },
                  ]}
                >
                  <Input placeholder="vd: Cà Mau" />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={creating}
                    block
                  >
                    Tạo lô
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          <Col xs={24} lg={14}>
            <Card title="Lô thủy sản của tôi" bordered={false}>
              <Table
                rowKey="seafoodId"
                columns={columns}
                dataSource={catches}
                loading={loadingList}
                pagination={{ pageSize: 5 }}
              />
            </Card>
          </Col>
        </Row>
      </Content>

      {/* Modal chuyển chủ sở hữu (TransferSeafood) */}
      <Modal
        title={
          selectedLot
            ? `Chuyển lô ${selectedLot.seafoodId} cho đơn vị khác`
            : "Chuyển chủ sở hữu"
        }
        open={transferModalOpen}
        onCancel={() => {
          setTransferModalOpen(false);
          setSelectedLot(null);
        }}
        footer={null}
        destroyOnClose
      >
        <Form layout="vertical" form={transferForm} onFinish={onTransferSubmit}>
          <Form.Item
            label="Tên tài khoản bên nhận (newOwner)"
            name="newOwner"
            rules={[{ required: true, message: "Vui lòng nhập username nhận" }]}
          >
            <Input placeholder="vd: processor1, transport1..." />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Xác nhận chuyển
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
}

// import React, { useEffect, useState } from "react";
// import {
//   Layout,
//   Typography,
//   Button,
//   Card,
//   Table,
//   Tag,
//   Space,
//   Modal,
//   Form,
//   Input,
//   DatePicker,
//   message,
// } from "antd";
// import {
//   LogoutOutlined,
//   ShopOutlined,
//   CheckCircleOutlined,
//   DollarOutlined,
// } from "@ant-design/icons";
// import dayjs from "dayjs";
// import api from "../../api/client";
// import { useAuth } from "../../context/useAuth";
// import { Link } from "react-router-dom";
// import QRCode from "qrcode.react";


// const { Header, Content } = Layout;
// const { Title, Text } = Typography;

// export default function RetailerDashboard() {
//   const { username, logout } = useAuth();
//   const [inventory, setInventory] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [receiveModalOpen, setReceiveModalOpen] = useState(false);
//   const [sellModalOpen, setSellModalOpen] = useState(false);
//   const [selectedLot, setSelectedLot] = useState(null);

//   const [receiveForm] = Form.useForm();
//   const [sellForm] = Form.useForm();

//   const loadInventory = async () => {
//     setLoading(true);
//     try {
//       const res = await api.get("/retailer/inventory");
//       setInventory(res.data || []);
//     } catch (err) {
//       console.error(err);
//       message.error("Không tải được tồn kho (Retailer).");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadInventory();
//   }, []);

//   const openReceiveModal = (record) => {
//     setSelectedLot(record);
//     receiveForm.resetFields();
//     receiveForm.setFieldsValue({ receivedCondition: "Bình thường" });
//     setReceiveModalOpen(true);
//   };

//   const openSellModal = (record) => {
//     setSelectedLot(record);
//     sellForm.resetFields();
//     sellForm.setFieldsValue({ soldDate: dayjs() });
//     setSellModalOpen(true);
//   };

//   const handleReceiveSubmit = async (values) => {
//     if (!selectedLot) return;
//     try {
//       await api.post(`/retailer/receive/${selectedLot.seafoodId}`, {
//         storeLocation: values.storeLocation,
//         receivedCondition: values.receivedCondition || "",
//       });
//       message.success("Xác nhận nhận hàng thành công");
//       setReceiveModalOpen(false);
//       loadInventory();
//     } catch (err) {
//       console.error(err);
//       message.error(
//         err.response?.data?.error || "Lỗi khi xác nhận nhận hàng."
//       );
//     }
//   };

//   const handleSellSubmit = async (values) => {
//     if (!selectedLot) return;
//     try {
//       await api.post(`/retailer/sell/${selectedLot.seafoodId}`, {
//         customerName: values.customerName,
//         soldDate: values.soldDate
//           ? values.soldDate.format("YYYY-MM-DD")
//           : "",
//       });
//       message.success("Ghi nhận bán hàng thành công");
//       setSellModalOpen(false);
//       loadInventory();
//     } catch (err) {
//       console.error(err);
//       message.error(
//         err.response?.data?.error || "Lỗi khi ghi nhận bán hàng."
//       );
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
//       render: (status) => <Tag color="volcano">{status}</Tag>,
//     },
//     {
//       title: "Chủ sở hữu",
//       dataIndex: "ownerId",
//       key: "ownerId",
//     },
//     {
//       title: "Thao tác",
//       key: "actions",
//       render: (_, record) => (
//         <Space>
//           <Button
//             size="small"
//             icon={<CheckCircleOutlined />}
//             onClick={() => openReceiveModal(record)}
//           >
//             Nhận hàng
//           </Button>
//           <Button
//             size="small"
//             icon={<DollarOutlined />}
//             onClick={() => openSellModal(record)}
//           >
//             Bán cho KH
//           </Button>
//           {/* 👇 Nút truy vết */}
//           <Link to={`/trace/${record.seafoodId}`}>
//             Truy vết
//           </Link>
//         </Space>
//       ),
//     },
//     {
//       title: "QR",
//       key: "qr",
//       render: (_, record) => (
//         <QRCode
//           value={`${window.location.origin}/trace/${record.seafoodId}`}
//           size={64}
//           level="H"
//           includeMargin={false}
//         />
//       ),
//     }

//   ];

//   return (
//     <Layout style={{ minHeight: "100vh" }}>
//       <Header
//         style={{
//           background: "#b45309",
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           paddingInline: 24,
//         }}
//       >
//         <div>
//           <Title level={4} style={{ color: "#fff", margin: 0 }}>
//             Retailer - Quản lý bán lẻ
//           </Title>
//           <Text style={{ color: "#ffedd5" }}>Người dùng: {username}</Text>
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
//         <Card
//           title={
//             <>
//               <ShopOutlined /> Tồn kho hiện tại
//             </>
//           }
//           bordered={false}
//         >
//           <Table
//             rowKey="seafoodId"
//             columns={columns}
//             dataSource={inventory}
//             loading={loading}
//             pagination={{ pageSize: 5 }}
//           />
//         </Card>

//         {/* Modal nhận hàng */}
//         <Modal
//           title={`Xác nhận nhận hàng - Lô ${selectedLot?.seafoodId || ""}`}
//           open={receiveModalOpen}
//           onCancel={() => setReceiveModalOpen(false)}
//           footer={null}
//           destroyOnClose
//         >
//           <Form layout="vertical" form={receiveForm} onFinish={handleReceiveSubmit}>
//             <Form.Item
//               label="Địa điểm cửa hàng"
//               name="storeLocation"
//               rules={[{ required: true, message: "Nhập địa điểm cửa hàng" }]}
//             >
//               <Input placeholder="vd: Siêu thị X, Quận Y" />
//             </Form.Item>
//             <Form.Item label="Tình trạng khi nhận" name="receivedCondition">
//               <Input placeholder="vd: Bình thường, đạt chuẩn..." />
//             </Form.Item>
//             <Form.Item>
//               <Button type="primary" htmlType="submit" block>
//                 Xác nhận
//               </Button>
//             </Form.Item>
//           </Form>
//         </Modal>

//         {/* Modal bán hàng */}
//         <Modal
//           title={`Bán cho khách hàng - Lô ${selectedLot?.seafoodId || ""}`}
//           open={sellModalOpen}
//           onCancel={() => setSellModalOpen(false)}
//           footer={null}
//           destroyOnClose
//         >
//           <Form layout="vertical" form={sellForm} onFinish={handleSellSubmit}>
//             <Form.Item
//               label="Tên khách hàng"
//               name="customerName"
//               rules={[{ required: true, message: "Nhập tên khách hàng" }]}
//             >
//               <Input placeholder="vd: Nguyễn Văn A" />
//             </Form.Item>
//             <Form.Item
//               label="Ngày bán"
//               name="soldDate"
//               rules={[{ required: true, message: "Chọn ngày bán" }]}
//             >
//               <DatePicker style={{ width: "100%" }} />
//             </Form.Item>
//             <Form.Item>
//               <Button type="primary" htmlType="submit" block>
//                 Ghi nhận bán hàng
//               </Button>
//             </Form.Item>
//           </Form>
//         </Modal>
//       </Content>
//     </Layout>
//   );
// }




import React, { useEffect, useState } from "react";
import {
  Layout,
  Typography,
  Button,
  Card,
  Table,
  Tag,
  Space,
  Modal,
  Form,
  Input,
  DatePicker,
  message,
} from "antd";
import {
  LogoutOutlined,
  ShopOutlined,
  CheckCircleOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import api from "../../api/client";
import { useAuth } from "../../context/useAuth";
import { Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";


import { Html5QrcodeScanner } from "html5-qrcode";

const { Header, Content } = Layout;
const { Title, Text } = Typography;


// const getBaseUrl = () => {
//   const { protocol, hostname, port } = window.location;

//   // Nếu đang chạy localhost hoặc 127.0.0.1 thì dùng IP LAN từ env
//   if (hostname === "localhost" || hostname === "127.0.0.1") {
//     const lanHost = import.meta.env.VITE_LAN_HOST || hostname;
//     const lanPort = import.meta.env.VITE_LAN_PORT || port;
//     return `${protocol}//${lanHost}${lanPort ? `:${lanPort}` : ""}`;
//   }

//   // Nếu đã truy cập bằng IP hoặc domain rồi thì dùng luôn origin hiện tại
//   return window.location.origin;
// };


const getBaseUrl = () => {
  const publicBase = import.meta.env.VITE_PUBLIC_BASE_URL;
  if (publicBase) return publicBase;          // ưu tiên dùng URL public (localtunnel)

  // fallback: dùng origin hiện tại
  return window.location.origin;
};


// Component quét QR
function QrScanner({ onScan }) {
  const readerId = "qr-reader";

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      readerId,
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      false
    );

    scanner.render(
      (decodedText) => {
        console.log("QR decoded:", decodedText);
        onScan && onScan(decodedText);
      },
      (errorMessage) => {
        console.log("QR scan error:", errorMessage);
      }
    );

    return () => {
      scanner
        .clear()
        .catch((err) => console.error("Failed to clear QR scanner", err));
    };
  }, []);

  return <div id={readerId} />;
}

export default function RetailerDashboard() {
  const { username, logout } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);

  const [receiveModalOpen, setReceiveModalOpen] = useState(false);
  const [sellModalOpen, setSellModalOpen] = useState(false);
  const [scanModalOpen, setScanModalOpen] = useState(false); // modal quét QR
  const [selectedLot, setSelectedLot] = useState(null);

  const [receiveForm] = Form.useForm();
  const [sellForm] = Form.useForm();

  const loadInventory = async () => {
    setLoading(true);
    try {
      const res = await api.get("/retailer/inventory");
      setInventory(res.data || []);
    } catch (err) {
      console.error(err);
      message.error("Không tải được tồn kho (Retailer).");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const openReceiveModal = (record) => {
    setSelectedLot(record);
    receiveForm.resetFields();
    receiveForm.setFieldsValue({ receivedCondition: "Bình thường" });
    setReceiveModalOpen(true);
  };

  const openSellModal = (record) => {
    setSelectedLot(record);
    sellForm.resetFields();
    sellForm.setFieldsValue({ soldDate: dayjs() });
    setSellModalOpen(true);
  };

  const handleReceiveSubmit = async (values) => {
    if (!selectedLot) return;
    try {
      await api.post(`/retailer/receive/${selectedLot.seafoodId}`, {
        storeLocation: values.storeLocation,
        receivedCondition: values.receivedCondition || "",
      });
      message.success("Xác nhận nhận hàng thành công");
      setReceiveModalOpen(false);
      loadInventory();
    } catch (err) {
      console.error(err);
      message.error(
        err.response?.data?.error || "Lỗi khi xác nhận nhận hàng."
      );
    }
  };

  const handleSellSubmit = async (values) => {
    if (!selectedLot) return;
    try {
      await api.post(`/retailer/sell/${selectedLot.seafoodId}`, {
        customerName: values.customerName,
        soldDate: values.soldDate
          ? values.soldDate.format("YYYY-MM-DD")
          : "",
      });
      message.success("Ghi nhận bán hàng thành công");
      setSellModalOpen(false);
      loadInventory();
    } catch (err) {
      console.error(err);
      message.error(
        err.response?.data?.error || "Lỗi khi ghi nhận bán hàng."
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
      render: (status) => <Tag color="volcano">{status}</Tag>,
    },
    {
      title: "Chủ sở hữu",
      dataIndex: "ownerId",
      key: "ownerId",
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            icon={<CheckCircleOutlined />}
            onClick={() => openReceiveModal(record)}
          >
            Nhận hàng
          </Button>
          <Button
            size="small"
            icon={<DollarOutlined />}
            onClick={() => openSellModal(record)}
          >
            Bán cho KH
          </Button>
          <Link to={`/trace/${record.seafoodId}`}>Truy vết</Link>
        </Space>
      ),
    },
    {
      title: "QR",
      key: "qr",
      render: (_, record) => (
        <QRCodeSVG
          value={`${getBaseUrl()}/trace/${record.seafoodId}`}
          size={64}
          level="H"
          includeMargin={false}
        />
      ),
    },



  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          background: "#b45309",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingInline: 24,
        }}
      >
        <div>
          <Title level={4} style={{ color: "#fff", margin: 0 }}>
            Retailer - Quản lý bán lẻ
          </Title>
          <Text style={{ color: "#ffedd5" }}>Người dùng: {username}</Text>
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
        <Card
          title={
            <>
              <ShopOutlined /> Tồn kho hiện tại
            </>
          }
          bordered={false}
          extra={
            <Button type="primary" onClick={() => setScanModalOpen(true)}>
              Quét mã QR
            </Button>
          }
        >
          <Table
            rowKey="seafoodId"
            columns={columns}
            dataSource={inventory}
            loading={loading}
            pagination={{ pageSize: 5 }}
          />
        </Card>

        {/* Modal nhận hàng */}
        <Modal
          title={`Xác nhận nhận hàng - Lô ${selectedLot?.seafoodId || ""}`}
          open={receiveModalOpen}
          onCancel={() => setReceiveModalOpen(false)}
          footer={null}
          destroyOnClose
        >
          <Form
            layout="vertical"
            form={receiveForm}
            onFinish={handleReceiveSubmit}
          >
            <Form.Item
              label="Địa điểm cửa hàng"
              name="storeLocation"
              rules={[{ required: true, message: "Nhập địa điểm cửa hàng" }]}
            >
              <Input placeholder="vd: Siêu thị X, Quận Y" />
            </Form.Item>
            <Form.Item label="Tình trạng khi nhận" name="receivedCondition">
              <Input placeholder="vd: Bình thường, đạt chuẩn..." />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Xác nhận
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal bán hàng */}
        <Modal
          title={`Bán cho khách hàng - Lô ${selectedLot?.seafoodId || ""}`}
          open={sellModalOpen}
          onCancel={() => setSellModalOpen(false)}
          footer={null}
          destroyOnClose
        >
          <Form layout="vertical" form={sellForm} onFinish={handleSellSubmit}>
            <Form.Item
              label="Tên khách hàng"
              name="customerName"
              rules={[{ required: true, message: "Nhập tên khách hàng" }]}
            >
              <Input placeholder="vd: Nguyễn Văn A" />
            </Form.Item>
            <Form.Item
              label="Ngày bán"
              name="soldDate"
              rules={[{ required: true, message: "Chọn ngày bán" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Ghi nhận bán hàng
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal quét mã QR */}
        <Modal
          title="Quét mã QR lô hàng"
          open={scanModalOpen}
          onCancel={() => setScanModalOpen(false)}
          footer={null}
          destroyOnClose
        >
          <QrScanner
            onScan={(text) => {
              message.success(`Đã đọc QR: ${text}`);
              try {
                if (text.startsWith("http")) {
                  window.location.href = text;
                } else {
                  window.location.href = `${window.location.origin}/trace/${text}`;
                }
              } catch (e) {
                console.error(e);
              }
              setScanModalOpen(false);
            }}
          />
        </Modal>
      </Content>
    </Layout>
  );
}

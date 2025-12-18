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
  InputNumber,
  DatePicker,
  message,
} from "antd";
import {
  LogoutOutlined,
  PlayCircleOutlined,
  CheckCircleOutlined,
  SwapRightOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import api from "../../api/client";
import { useAuth } from "../../context/useAuth";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

export default function TransportDashboard() {
  const { username, logout } = useAuth();
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(false);

  const [startModalOpen, setStartModalOpen] = useState(false);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [selectedLot, setSelectedLot] = useState(null);

  const [startForm] = Form.useForm();
  const [completeForm] = Form.useForm();
  const [transferForm] = Form.useForm();

  const loadMyShipments = async () => {
    setLoading(true);
    try {
      const res = await api.get("/transport/my-shipments");
      setShipments(res.data || []);
    } catch (err) {
      console.error(err);
      message.error("Không tải được danh sách lô vận chuyển.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyShipments();
  }, []);

  const openStartModal = (record) => {
    setSelectedLot(record);
    startForm.resetFields();
    startForm.setFieldsValue({ startDate: dayjs(), temperature: 0 });
    setStartModalOpen(true);
  };

  const openCompleteModal = (record) => {
    setSelectedLot(record);
    completeForm.resetFields();
    completeForm.setFieldsValue({ arrivedAt: dayjs() });
    setCompleteModalOpen(true);
  };

  const openTransferModal = (record) => {
    setSelectedLot(record);
    transferForm.resetFields();
    setTransferModalOpen(true);
  };

  const handleStartSubmit = async (values) => {
    if (!selectedLot) return;
    try {
      await api.post(`/transport/start/${selectedLot.seafoodId}`, {
        fromLocation: values.fromLocation,
        toLocation: values.toLocation,
        temperature: values.temperature,
      });
      message.success("Bắt đầu vận chuyển thành công");
      setStartModalOpen(false);
      loadMyShipments();
    } catch (err) {
      console.error(err);
      message.error(
        err.response?.data?.error || "Lỗi khi bắt đầu vận chuyển."
      );
    }
  };

  const handleCompleteSubmit = async (values) => {
    if (!selectedLot) return;
    try {
      await api.post(`/transport/complete/${selectedLot.seafoodId}`, {
        arrivedAt: values.arrivedAt
          ? values.arrivedAt.format("YYYY-MM-DD")
          : "",
        condition: values.condition || "",
      });
      message.success("Hoàn tất vận chuyển thành công");
      setCompleteModalOpen(false);
      loadMyShipments();
    } catch (err) {
      console.error(err);
      message.error(
        err.response?.data?.error || "Lỗi khi hoàn tất vận chuyển."
      );
    }
  };

  const handleTransferSubmit = async (values) => {
    if (!selectedLot) return;
    try {
      await api.post(`/transport/transfer/${selectedLot.seafoodId}`, {
        newOwner: values.newOwner,
      });
      message.success("Chuyển lô cho Distributor thành công");
      setTransferModalOpen(false);
      loadMyShipments();
    } catch (err) {
      console.error(err);
      message.error(
        err.response?.data?.error || "Lỗi khi chuyển lô cho Distributor."
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
      render: (status) => <Tag color="geekblue">{status}</Tag>,
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
            icon={<PlayCircleOutlined />}
            onClick={() => openStartModal(record)}
          >
            Bắt đầu
          </Button>
          <Button
            size="small"
            icon={<CheckCircleOutlined />}
            onClick={() => openCompleteModal(record)}
          >
            Hoàn tất
          </Button>
          <Button
            size="small"
            icon={<SwapRightOutlined />}
            onClick={() => openTransferModal(record)}
          >
            Chuyển Distributor
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          background: "#1d4ed8",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingInline: 24,
        }}
      >
        <div>
          <Title level={4} style={{ color: "#fff", margin: 0 }}>
            Transport - Quản lý vận chuyển
          </Title>
          <Text style={{ color: "#bfdbfe" }}>Người dùng: {username}</Text>
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
        <Card title="Danh sách lô đang vận chuyển" bordered={false}>
          <Table
            rowKey="seafoodId"
            columns={columns}
            dataSource={shipments}
            loading={loading}
            pagination={{ pageSize: 5 }}
          />
        </Card>

        {/* Modal bắt đầu vận chuyển */}
        <Modal
          title={`Bắt đầu vận chuyển - Lô ${selectedLot?.seafoodId || ""}`}
          open={startModalOpen}
          onCancel={() => setStartModalOpen(false)}
          footer={null}
          destroyOnClose
        >
          <Form layout="vertical" form={startForm} onFinish={handleStartSubmit}>
            <Form.Item
              label="Điểm xuất phát"
              name="fromLocation"
              rules={[{ required: true, message: "Nhập điểm xuất phát" }]}
            >
              <Input placeholder="vd: Cảng A" />
            </Form.Item>
            <Form.Item
              label="Điểm đến"
              name="toLocation"
              rules={[{ required: true, message: "Nhập điểm đến" }]}
            >
              <Input placeholder="vd: Nhà máy B" />
            </Form.Item>
            <Form.Item
              label="Nhiệt độ bảo quản (°C)"
              name="temperature"
            >
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Xác nhận bắt đầu
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal hoàn tất vận chuyển */}
        <Modal
          title={`Hoàn tất vận chuyển - Lô ${selectedLot?.seafoodId || ""}`}
          open={completeModalOpen}
          onCancel={() => setCompleteModalOpen(false)}
          footer={null}
          destroyOnClose
        >
          <Form
            layout="vertical"
            form={completeForm}
            onFinish={handleCompleteSubmit}
          >
            <Form.Item
              label="Ngày đến"
              name="arrivedAt"
              rules={[{ required: true, message: "Chọn ngày đến" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item label="Tình trạng hàng" name="condition">
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Xác nhận hoàn tất
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal chuyển cho Distributor */}
        <Modal
          title={`Chuyển cho Distributor - Lô ${selectedLot?.seafoodId || ""}`}
          open={transferModalOpen}
          onCancel={() => setTransferModalOpen(false)}
          footer={null}
          destroyOnClose
        >
          <Form layout="vertical" form={transferForm} onFinish={handleTransferSubmit}>
            <Form.Item
              label="Tên tài khoản Distributor (newOwner)"
              name="newOwner"
              rules={[{ required: true, message: "Nhập username Distributor" }]}
            >
              <Input placeholder="vd: dist1" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Chuyển lô
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
}

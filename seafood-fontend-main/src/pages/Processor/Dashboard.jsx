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
import { LogoutOutlined, ExperimentOutlined, SwapRightOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import api from "../../api/client";
import { useAuth } from "../../context/useAuth";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

export default function ProcessorDashboard() {
  const { username, logout } = useAuth();
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(false);

  const [processModalOpen, setProcessModalOpen] = useState(false);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [selectedLot, setSelectedLot] = useState(null);

  const [processForm] = Form.useForm();
  const [transferForm] = Form.useForm();

  const loadMyLots = async () => {
    setLoading(true);
    try {
      const res = await api.get("/processor/my-lots");
      setLots(res.data || []);
    } catch (err) {
      console.error(err);
      message.error("Không tải được danh sách lô hàng (Processor).");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyLots();
  }, []);

  const openProcessModal = (record) => {
    setSelectedLot(record);
    processForm.resetFields();
    processForm.setFieldsValue({
      processDate: dayjs(),
    });
    setProcessModalOpen(true);
  };

  const openTransferModal = (record) => {
    setSelectedLot(record);
    transferForm.resetFields();
    setTransferModalOpen(true);
  };

  const handleProcessSubmit = async (values) => {
    if (!selectedLot) return;
    try {
      const payload = {
        processId: values.processId,
        factoryName: values.factoryName,
        processDate: values.processDate
          ? values.processDate.format("YYYY-MM-DD")
          : "",
        method: values.method || "",
        qualityCheck: values.qualityCheck || "",
        note: values.note || "",
      };

      await api.post(`/processor/process/${selectedLot.seafoodId}`, payload);
      message.success("Cập nhật thông tin chế biến thành công");
      setProcessModalOpen(false);
      loadMyLots();
    } catch (err) {
      console.error(err);
      message.error(
        err.response?.data?.error || "Lỗi khi cập nhật thông tin chế biến."
      );
    }
  };

  const handleTransferSubmit = async (values) => {
    if (!selectedLot) return;
    try {
      await api.post(`/processor/transfer/${selectedLot.seafoodId}`, {
        newOwner: values.newOwner,
      });
      message.success("Chuyển lô cho đơn vị vận chuyển thành công");
      setTransferModalOpen(false);
      loadMyLots();
    } catch (err) {
      console.error(err);
      message.error(
        err.response?.data?.error || "Lỗi khi chuyển lô cho đơn vị vận chuyển."
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
      render: (status) => <Tag color="purple">{status}</Tag>,
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
            icon={<ExperimentOutlined />}
            onClick={() => openProcessModal(record)}
          >
            Chế biến
          </Button>
          <Button
            size="small"
            icon={<SwapRightOutlined />}
            onClick={() => openTransferModal(record)}
          >
            Chuyển cho Transport
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          background: "#4c1d95",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingInline: 24,
        }}
      >
        <div>
          <Title level={4} style={{ color: "#fff", margin: 0 }}>
            Processor - Quản lý chế biến
          </Title>
          <Text style={{ color: "#e9d5ff" }}>Người dùng: {username}</Text>
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
        <Card title="Danh sách lô đang phụ trách" bordered={false}>
          <Table
            rowKey="seafoodId"
            columns={columns}
            dataSource={lots}
            loading={loading}
            pagination={{ pageSize: 5 }}
          />
        </Card>

        {/* Modal chế biến */}
        <Modal
          title={`Cập nhật chế biến - Lô ${selectedLot?.seafoodId || ""}`}
          open={processModalOpen}
          onCancel={() => setProcessModalOpen(false)}
          footer={null}
          destroyOnClose
        >
          <Form layout="vertical" form={processForm} onFinish={handleProcessSubmit}>
            <Form.Item
              label="Mã chế biến (processId)"
              name="processId"
              rules={[{ required: true, message: "Nhập mã chế biến" }]}
            >
              <Input placeholder="vd: P001" />
            </Form.Item>
            <Form.Item
              label="Nhà máy chế biến"
              name="factoryName"
              rules={[{ required: true, message: "Nhập tên nhà máy" }]}
            >
              <Input placeholder="vd: Nhà máy A" />
            </Form.Item>
            <Form.Item
              label="Ngày chế biến"
              name="processDate"
              rules={[{ required: true, message: "Chọn ngày chế biến" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item label="Phương pháp" name="method">
              <Input placeholder="vd: Đông lạnh, hun khói..." />
            </Form.Item>
            <Form.Item label="Kiểm tra chất lượng" name="qualityCheck">
              <Input placeholder="Đạt/Không đạt hoặc ghi chú thêm" />
            </Form.Item>
            <Form.Item label="Ghi chú" name="note">
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Lưu thông tin
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal chuyển cho Transport */}
        <Modal
          title={`Chuyển lô cho Transport - Lô ${selectedLot?.seafoodId || ""}`}
          open={transferModalOpen}
          onCancel={() => setTransferModalOpen(false)}
          footer={null}
          destroyOnClose
        >
          <Form layout="vertical" form={transferForm} onFinish={handleTransferSubmit}>
            <Form.Item
              label="Tên tài khoản Transport (newOwner)"
              name="newOwner"
              rules={[{ required: true, message: "Nhập username của Transport" }]}
            >
              <Input placeholder="vd: transport1" />
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

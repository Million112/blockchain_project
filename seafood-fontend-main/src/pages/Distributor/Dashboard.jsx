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
  DeploymentUnitOutlined,
  SwapRightOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import api from "../../api/client";
import { useAuth } from "../../context/useAuth";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

export default function DistributorDashboard() {
  const { username, logout } = useAuth();
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(false);

  const [distModalOpen, setDistModalOpen] = useState(false);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [selectedLot, setSelectedLot] = useState(null);

  const [distForm] = Form.useForm();
  const [transferForm] = Form.useForm();

  const loadMyLots = async () => {
    setLoading(true);
    try {
      const res = await api.get("/distributor/my-lots");
      setLots(res.data || []);
    } catch (err) {
      console.error(err);
      message.error("Không tải được danh sách lô (Distributor).");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyLots();
  }, []);

  const openDistModal = (record) => {
    setSelectedLot(record);
    distForm.resetFields();
    distForm.setFieldsValue({ receivedDate: dayjs() });
    setDistModalOpen(true);
  };

  const openTransferModal = (record) => {
    setSelectedLot(record);
    transferForm.resetFields();
    setTransferModalOpen(true);
  };

  const handleDistSubmit = async (values) => {
    if (!selectedLot) return;
    try {
      await api.post(`/distributor/distribution/${selectedLot.seafoodId}`, {
        distributionId: values.distributionId,
        location: values.location,
        receivedDate: values.receivedDate
          ? values.receivedDate.format("YYYY-MM-DD")
          : "",
        soldDate: values.soldDate
          ? values.soldDate.format("YYYY-MM-DD")
          : "",
        note: values.note || "",
      });
      message.success("Ghi thông tin phân phối thành công");
      setDistModalOpen(false);
      loadMyLots();
    } catch (err) {
      console.error(err);
      message.error(
        err.response?.data?.error || "Lỗi khi ghi thông tin phân phối."
      );
    }
  };

  const handleTransferSubmit = async (values) => {
    if (!selectedLot) return;
    try {
      await api.post(`/distributor/transfer/${selectedLot.seafoodId}`, {
        newOwner: values.newOwner,
      });
      message.success("Chuyển lô cho Retailer thành công");
      setTransferModalOpen(false);
      loadMyLots();
    } catch (err) {
      console.error(err);
      message.error(
        err.response?.data?.error || "Lỗi khi chuyển lô cho Retailer."
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
      render: (status) => <Tag color="green">{status}</Tag>,
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
            icon={<DeploymentUnitOutlined />}
            onClick={() => openDistModal(record)}
          >
            Ghi phân phối
          </Button>
          <Button
            size="small"
            icon={<SwapRightOutlined />}
            onClick={() => openTransferModal(record)}
          >
            Chuyển Retailer
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          background: "#15803d",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingInline: 24,
        }}
      >
        <div>
          <Title level={4} style={{ color: "#fff", margin: 0 }}>
            Distributor - Quản lý phân phối
          </Title>
          <Text style={{ color: "#bbf7d0" }}>Người dùng: {username}</Text>
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
        <Card title="Danh sách lô đang phân phối" bordered={false}>
          <Table
            rowKey="seafoodId"
            columns={columns}
            dataSource={lots}
            loading={loading}
            pagination={{ pageSize: 5 }}
          />
        </Card>

        {/* Modal ghi phân phối */}
        <Modal
          title={`Ghi thông tin phân phối - Lô ${selectedLot?.seafoodId || ""}`}
          open={distModalOpen}
          onCancel={() => setDistModalOpen(false)}
          footer={null}
          destroyOnClose
        >
          <Form layout="vertical" form={distForm} onFinish={handleDistSubmit}>
            <Form.Item
              label="Mã phân phối (distributionId)"
              name="distributionId"
              rules={[{ required: true, message: "Nhập mã phân phối" }]}
            >
              <Input placeholder="vd: D001" />
            </Form.Item>
            <Form.Item
              label="Địa điểm phân phối"
              name="location"
              rules={[{ required: true, message: "Nhập địa điểm phân phối" }]}
            >
              <Input placeholder="vd: Kho miền Tây" />
            </Form.Item>
            <Form.Item
              label="Ngày nhận"
              name="receivedDate"
              rules={[{ required: true, message: "Chọn ngày nhận" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item label="Ngày bán (nếu có)" name="soldDate">
              <DatePicker style={{ width: "100%" }} />
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

        {/* Modal chuyển cho Retailer */}
        <Modal
          title={`Chuyển cho Retailer - Lô ${selectedLot?.seafoodId || ""}`}
          open={transferModalOpen}
          onCancel={() => setTransferModalOpen(false)}
          footer={null}
          destroyOnClose
        >
          <Form layout="vertical" form={transferForm} onFinish={handleTransferSubmit}>
            <Form.Item
              label="Tên tài khoản Retailer (newOwner)"
              name="newOwner"
              rules={[{ required: true, message: "Nhập username Retailer" }]}
            >
              <Input placeholder="vd: retail1" />
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

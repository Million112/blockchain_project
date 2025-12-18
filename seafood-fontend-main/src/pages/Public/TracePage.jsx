import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Layout,
  Card,
  Typography,
  Input,
  Button,
  message,
  Descriptions,
  Tag,
  Timeline,
  Spin,
} from "antd";
import { SearchOutlined, RollbackOutlined } from "@ant-design/icons";
import api from "../../api/client";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

export default function TracePage() {
  const { id: paramId } = useParams(); // /trace/:id
  const navigate = useNavigate();

  const [inputId, setInputId] = useState(paramId || "");
  const [loading, setLoading] = useState(false);
  const [seafood, setSeafood] = useState(null);

  const loadTrace = async (seafoodId) => {
    if (!seafoodId) {
      message.warning("Vui lòng nhập mã lô (vd: S001)");
      return;
    }
    setLoading(true);
    try {
      const res = await api.get(`/public/trace/${seafoodId}`);
      setSeafood(res.data.seafood);
      if (!paramId) {
        // cập nhật URL cho đẹp
        navigate(`/trace/${seafoodId}`, { replace: true });
      }
    } catch (err) {
      console.error(err);
      setSeafood(null);
      message.error(
        err.response?.data?.error || "Không tìm thấy thông tin lô này."
      );
    } finally {
      setLoading(false);
    }
  };

  // nếu có paramId trong URL, tự load
  useEffect(() => {
    if (paramId) {
      loadTrace(paramId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramId]);

  const historyItems =
    seafood?.history?.map((h, idx) => ({
      key: idx,
      label: h.timestamp || "",
      children: (
        <div>
          <Tag color="blue">{h.type}</Tag>
          <pre
            style={{
              background: "#020617",
              color: "#e5e7eb",
              padding: 8,
              borderRadius: 8,
              fontSize: 12,
              marginTop: 8,
              overflowX: "auto",
            }}
          >
            {JSON.stringify(h.data, null, 2)}
          </pre>
        </div>
      ),
    })) || [];

  return (
    <Layout style={{ minHeight: "100vh", background: "#0f172a" }}>
      <Header
        style={{
          background: "transparent",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Title level={3} style={{ color: "#e5e7eb", margin: 0 }}>
          Truy vết chuỗi cung ứng thủy sản
        </Title>
        <Button
          icon={<RollbackOutlined />}
          onClick={() => navigate("/login")}
        >
          Về trang đăng nhập
        </Button>
      </Header>

      <Content style={{ padding: 24 }}>
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
          }}
        >
          {/* Box nhập mã lô */}
          <Card
            style={{ marginBottom: 16 }}
            bodyStyle={{ display: "flex", gap: 8, alignItems: "center" }}
          >
            <Input
              placeholder="Nhập mã lô thủy sản (vd: S001)"
              value={inputId}
              onChange={(e) => setInputId(e.target.value)}
              onPressEnter={() => loadTrace(inputId.trim())}
            />
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() => loadTrace(inputId.trim())}
              loading={loading}
            >
              Truy vết
            </Button>
          </Card>

          {loading && (
            <div
              style={{
                padding: 40,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Spin size="large" />
            </div>
          )}

          {!loading && seafood && (
            <div style={{ display: "grid", gap: 16, gridTemplateColumns: "2fr 3fr" }}>
              {/* Thông tin tổng quan */}
              <Card title="Thông tin lô" bordered={false}>
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Mã lô">
                    <Tag color="cyan">{seafood.seafoodId}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Loài">
                    {seafood.species}
                  </Descriptions.Item>
                  <Descriptions.Item label="Nguồn gốc">
                    {seafood.origin}
                  </Descriptions.Item>
                  <Descriptions.Item label="Trạng thái hiện tại">
                    <Tag color="green">{seafood.status}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Chủ sở hữu hiện tại">
                    {seafood.ownerId || (
                      <Text type="secondary">Chưa xác định</Text>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Cập nhật gần nhất">
                    {seafood.timestamp}
                  </Descriptions.Item>
                </Descriptions>
              </Card>

              {/* Timeline lịch sử */}
              <Card title="Lịch sử chuỗi cung ứng (từ đánh bắt tới bán lẻ)">
                {historyItems.length === 0 ? (
                  <Text type="secondary">
                    Chưa có lịch sử cho lô này.
                  </Text>
                ) : (
                  <Timeline
                    mode="left"
                    items={historyItems.map((item) => ({
                      label: item.label,
                      children: item.children,
                    }))}
                  />
                )}
              </Card>
            </div>
          )}

          {!loading && !seafood && paramId && (
            <Card style={{ marginTop: 16 }}>
              <Text type="danger">
                Không tìm thấy lô với mã: {paramId}
              </Text>
            </Card>
          )}
        </div>
      </Content>
    </Layout>
  );
}

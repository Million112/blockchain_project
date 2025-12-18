import React, { useState } from "react";
import { Form, Input, Button, Card, message } from "antd";
import { addCatch } from "../../services/seafoodAPI";

export default function AddCatch() {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      await addCatch(values);
      message.success("Thêm thông tin đánh bắt thành công!");
    } catch (err) {
      message.error(err.response?.data?.error || "Lỗi khi thêm lô hàng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Thêm thông tin đánh bắt" style={{ maxWidth: 600, margin: "20px auto" }}>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="seafoodId" label="Mã lô hàng" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="species" label="Loài thủy sản" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="origin" label="Nguồn gốc" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="seaArea" label="Vùng biển đánh bắt">
          <Input />
        </Form.Item>
        <Form.Item name="quantity" label="Sản lượng (kg)">
          <Input type="number" />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Gửi thông tin
        </Button>
      </Form>
    </Card>
  );
}

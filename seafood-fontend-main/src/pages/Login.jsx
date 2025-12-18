import React, { useState, useContext } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { login as loginApi } from '../services/authApi';
import { AuthContext } from '../context/AuthContext';
import { LockOutlined, UserOutlined } from '@ant-design/icons';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const data = await loginApi(values.username, values.password);
      login(data);
      message.success('Đăng nhập thành công!');
      
      window.location.href = '/dashboard'; // hoặc trang phù hợp với role
    } catch (err) {
      message.error('Tên đăng nhập hoặc mật khẩu sai!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      height: '100vh', background: 'linear-gradient(to right, #74ABE2, #5563DE)'
    }}>
      <Card
        style={{ width: 350, borderRadius: 10, boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}
        title={<h2 style={{ textAlign: 'center' }}>Đăng nhập hệ thống</h2>}
      >
        <Form name="login" onFinish={onFinish} layout="vertical">
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Tên đăng nhập" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
          >
            Đăng nhập
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default Login;

import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, message, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import axiosAdmin from "../../services/axiosAdmin";

const { Option } = Select;

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  const fetchUsers = async () => {
    try {
      const res = await axiosAdmin.get('/users');
      setUsers(res.data);
    } catch (err) {
      message.error('Không thể tải danh sách người dùng');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenModal = (user = null) => {
    setEditingUser(user);
    form.resetFields();
    if (user) form.setFieldsValue(user);
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingUser) {
        // Update user
        await axios.put(`http://localhost:5000/api/users/${editingUser._id}`, values);
        message.success('Cập nhật người dùng thành công');
      } else {
        // Add user
        await axios.post('http://localhost:5000/api/users', values);
        message.success('Thêm người dùng thành công');
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      message.error('Thao tác thất bại');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      message.success('Xóa người dùng thành công');
      fetchUsers();
    } catch (err) {
      message.error('Không thể xóa người dùng');
    }
  };

  const columns = [
    { title: 'Tên đăng nhập', dataIndex: 'username', key: 'username' },
    { title: 'Tổ chức', dataIndex: 'organization', key: 'organization' },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role) => role || '—',
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleOpenModal(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa người dùng này?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button type="link" danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => handleOpenModal()}
        >
          Thêm người dùng
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={users.map((u) => ({ ...u, key: u._id }))}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editingUser ? 'Cập nhật người dùng' : 'Thêm người dùng mới'}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={[{ required: true, message: 'Nhập tên đăng nhập' }]}
          >
            <Input />
          </Form.Item>
          {!editingUser && (
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: 'Nhập mật khẩu' }]}
            >
              <Input.Password />
            </Form.Item>
          )}
          <Form.Item name="organization" label="Tổ chức">
            <Input />
          </Form.Item>
          <Form.Item
            name="role"
            label="Vai trò"
            rules={[{ required: true, message: 'Chọn vai trò' }]}
          >
            <Select placeholder="Chọn vai trò">
              <Option value="Admin">Admin</Option>
              <Option value="Fisherman">Fisherman</Option>
              <Option value="Processor">Processor</Option>
              <Option value="Transporter">Transporter</Option>
              <Option value="Retailer">Retailer</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManager;

// src/pages/Fisherman/CatchDetail.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/client";
import { useAuth } from "../../context/useAuth";
import "../../styles.css";

export default function CatchDetail() {
  const { id } = useParams(); // seafoodId
  const { logout } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const [catchForm, setCatchForm] = useState({
    seaArea: "",
    quantity: "",
    catchDate: "",
    note: "",
  });

  // ✅ Bọc bằng useCallback để không tạo hàm mới mỗi lần render
  const loadDetail = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/fisherman/detail/${id}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
      setError("Không tải được thông tin lô.");
    } finally {
      setLoading(false);
    }
  }, [id]); // 👈 phụ thuộc vào id

  useEffect(() => {
    loadDetail();
  }, [loadDetail]); // ✅ giờ dependency đầy đủ, ESLint hết báo

  const handleCatchChange = (e) => {
    setCatchForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleUpdateCatch = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError("");
    try {
      await api.put(`/fisherman/update/${id}`, catchForm);
      await loadDetail(); // ✅ dùng lại được
      alert("Cập nhật thông tin đánh bắt thành công!");
      setCatchForm({ seaArea: "", quantity: "", catchDate: "", note: "" });
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error || "Cập nhật thông tin đánh bắt thất bại."
      );
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="page">
      <header className="topbar">
        <div className="topbar-left">
          <h1>Chi tiết lô thủy sản #{id}</h1>
          <Link to="/fisherman" className="topbar-back">
            ← Quay lại danh sách
          </Link>
        </div>
        <button className="topbar-logout" onClick={logout}>
          Đăng xuất
        </button>
      </header>

      <div className="layout">
        <div className="card">
          <h2>Thông tin chung</h2>
          {loading ? (
            <div>Đang tải...</div>
          ) : error ? (
            <div className="alert-error">{error}</div>
          ) : !data ? (
            <div>Không có dữ liệu.</div>
          ) : (
            <div className="detail-grid">
              <div>
                <strong>Mã lô:</strong> {data.seafoodId}
              </div>
              <div>
                <strong>Loài:</strong> {data.species}
              </div>
              <div>
                <strong>Nguồn gốc:</strong> {data.origin}
              </div>
              <div>
                <strong>Trạng thái:</strong> {data.status}
              </div>
              <div>
                <strong>Chủ sở hữu:</strong> {data.ownerId}
              </div>
              <div>
                <strong>Cập nhật gần nhất:</strong> {data.timestamp}
              </div>
            </div>
          )}
        </div>

        <div className="card">
          <h2>Thêm/Cập nhật thông tin đánh bắt</h2>
          <form className="form-grid" onSubmit={handleUpdateCatch}>
            <label>
              Khu vực đánh bắt (seaArea)
              <input
                name="seaArea"
                value={catchForm.seaArea}
                onChange={handleCatchChange}
                placeholder="vd: Vùng biển Cà Mau"
                required
              />
            </label>

            <label>
              Số lượng (kg)
              <input
                name="quantity"
                type="number"
                value={catchForm.quantity}
                onChange={handleCatchChange}
                placeholder="vd: 500"
                required
              />
            </label>

            <label>
              Ngày đánh bắt
              <input
                name="catchDate"
                type="date"
                value={catchForm.catchDate}
                onChange={handleCatchChange}
                required
              />
            </label>

            <label>
              Ghi chú
              <textarea
                name="note"
                value={catchForm.note}
                onChange={handleCatchChange}
                placeholder="Thông tin bổ sung..."
              />
            </label>

            <div className="form-actions">
              <button type="submit" disabled={updating}>
                {updating ? "Đang cập nhật..." : "Lưu thông tin đánh bắt"}
              </button>
            </div>
          </form>
        </div>

        <div className="card">
          <h2>Lịch sử (history)</h2>
          {!data || !data.history || data.history.length === 0 ? (
            <div>Chưa có lịch sử.</div>
          ) : (
            <ul className="history-list">
              {data.history.map((h, idx) => (
                <li key={idx} className="history-item">
                  <div className="history-type">{h.type}</div>
                  <div className="history-time">{h.timestamp}</div>
                  <pre className="history-json">
                    {JSON.stringify(h.data, null, 2)}
                  </pre>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}










// // src/pages/Fisherman/CatchDetail.jsx
// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import {
//   Layout,
//   Typography,
//   Button,
//   Card,
//   Descriptions,
//   Form,
//   Input,
//   InputNumber,
//   DatePicker,
//   List,
//   Tag,
//   message,
// } from "antd";
// import { ArrowLeftOutlined, LogoutOutlined } from "@ant-design/icons";
// import dayjs from "dayjs";
// import api from "../../api/client";
// import { useAuth } from "../../context/AuthContext";

// const { Header, Content } = Layout;
// const { Title, Text } = Typography;
// const { TextArea } = Input;

// export default function CatchDetail() {
//   const { id } = useParams();
//   const { logout } = useAuth();

//   const [data, setData] = useState(null);
//   const [loadingDetail, setLoadingDetail] = useState(false);
//   const [updating, setUpdating] = useState(false);
//   const [form] = Form.useForm();

//   const loadDetail = async () => {
//     setLoadingDetail(true);
//     try {
//       const res = await api.get(`/fisherman/detail/${id}`);
//       setData(res.data);
//     } catch (err) {
//       console.error(err);
//       message.error("Không tải được thông tin lô.");
//     } finally {
//       setLoadingDetail(false);
//     }
//   };

//   useEffect(() => {
//     loadDetail();
//   }, [id]);

//   const onUpdateCatch = async (values) => {
//     setUpdating(true);
//     try {
//       const payload = {
//         seaArea: values.seaArea,
//         quantity: values.quantity,
//         catchDate: values.catchDate
//           ? values.catchDate.format("YYYY-MM-DD")
//           : "",
//         note: values.note || "",
//       };

//       await api.put(`/fisherman/update/${id}`, payload);
//       message.success("Cập nhật thông tin đánh bắt thành công");
//       form.resetFields();
//       loadDetail();
//     } catch (err) {
//       console.error(err);
//       message.error(
//         err.response?.data?.error || "Cập nhật thông tin đánh bắt thất bại."
//       );
//     } finally {
//       setUpdating(false);
//     }
//   };

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
//         <div style={{ display: "flex", flexDirection: "column" }}>
//           <Title level={4} style={{ color: "#fff", margin: 0 }}>
//             Chi tiết lô thủy sản #{id}
//           </Title>
//           <Link
//             to="/fisherman"
//             style={{ color: "#d1fae5", fontSize: 13, marginTop: 4 }}
//           >
//             <ArrowLeftOutlined /> Quay lại danh sách
//           </Link>
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
//         <div style={{ display: "grid", gap: 16, gridTemplateColumns: "2fr 3fr" }}>
//           <div style={{ minWidth: 0 }}>
//             <Card
//               title="Thông tin chung"
//               loading={loadingDetail}
//             >
//               {data && (
//                 <Descriptions column={1} size="small">
//                   <Descriptions.Item label="Mã lô">
//                     {data.seafoodId}
//                   </Descriptions.Item>
//                   <Descriptions.Item label="Loài">
//                     {data.species}
//                   </Descriptions.Item>
//                   <Descriptions.Item label="Nguồn gốc">
//                     {data.origin}
//                   </Descriptions.Item>
//                   <Descriptions.Item label="Trạng thái">
//                     <Tag color="blue">{data.status}</Tag>
//                   </Descriptions.Item>
//                   <Descriptions.Item label="Chủ sở hữu">
//                     {data.ownerId || (
//                       <Text type="secondary">Chưa gán</Text>
//                     )}
//                   </Descriptions.Item>
//                   <Descriptions.Item label="Cập nhật gần nhất">
//                     {data.timestamp}
//                   </Descriptions.Item>
//                 </Descriptions>
//               )}
//             </Card>

//             <Card
//               title="Thêm / Cập nhật thông tin đánh bắt"
//               style={{ marginTop: 16 }}
//             >
//               <Form
//                 layout="vertical"
//                 form={form}
//                 onFinish={onUpdateCatch}
//               >
//                 <Form.Item
//                   label="Khu vực đánh bắt (seaArea)"
//                   name="seaArea"
//                   rules={[{ required: true, message: "Nhập khu vực đánh bắt" }]}
//                 >
//                   <Input placeholder="vd: Vùng biển Cà Mau" />
//                 </Form.Item>

//                 <Form.Item
//                   label="Số lượng (kg)"
//                   name="quantity"
//                   rules={[{ required: true, message: "Nhập số lượng (kg)" }]}
//                 >
//                   <InputNumber
//                     style={{ width: "100%" }}
//                     min={0}
//                     placeholder="vd: 500"
//                   />
//                 </Form.Item>

//                 <Form.Item
//                   label="Ngày đánh bắt"
//                   name="catchDate"
//                   rules={[{ required: true, message: "Chọn ngày đánh bắt" }]}
//                 >
//                   <DatePicker
//                     style={{ width: "100%" }}
//                     format="YYYY-MM-DD"
//                     defaultValue={dayjs()}
//                   />
//                 </Form.Item>

//                 <Form.Item label="Ghi chú" name="note">
//                   <TextArea rows={3} placeholder="Thông tin bổ sung..." />
//                 </Form.Item>

//                 <Form.Item>
//                   <Button
//                     type="primary"
//                     htmlType="submit"
//                     loading={updating}
//                     block
//                   >
//                     Lưu thông tin đánh bắt
//                   </Button>
//                 </Form.Item>
//               </Form>
//             </Card>
//           </div>

//           <div style={{ minWidth: 0 }}>
//             <Card title="Lịch sử (history)">
//               {!data || !data.history || data.history.length === 0 ? (
//                 <Text type="secondary">Chưa có lịch sử.</Text>
//               ) : (
//                 <List
//                   itemLayout="vertical"
//                   dataSource={data.history}
//                   renderItem={(item, index) => (
//                     <List.Item key={index}>
//                       <List.Item.Meta
//                         title={
//                           <>
//                             <Tag>{item.type}</Tag>{" "}
//                             <Text type="secondary" style={{ fontSize: 12 }}>
//                               {item.timestamp}
//                             </Text>
//                           </>
//                         }
//                         description={
//                           <pre
//                             style={{
//                               background: "#111827",
//                               color: "#e5e7eb",
//                               borderRadius: 8,
//                               padding: 8,
//                               fontSize: 12,
//                               overflowX: "auto",
//                               margin: 0,
//                             }}
//                           >
//                             {JSON.stringify(item.data, null, 2)}
//                           </pre>
//                         }
//                       />
//                     </List.Item>
//                   )}
//                 />
//               )}
//             </Card>
//           </div>
//         </div>
//       </Content>
//     </Layout>
//   );
// }

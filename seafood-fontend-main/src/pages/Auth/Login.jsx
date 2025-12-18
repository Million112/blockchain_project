// src/pages/Auth/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import "../../styles.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      var info=await login(form.username, form.password);
      
      switch (info.role) {
        case "Fisherman":
          navigate("/fisherman");
          break;
        case "Processor":
          navigate("/Processor");
          break;
        case "Transporter":
          navigate("/transport");
          break;
        case "Distributor":
          navigate("/distributor");
          break;
        case "Retailer":
          navigate("/retailer");
          break;
        case "ADMIN":
        default:
          navigate("/fisherman");
          break;
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error || "Đăng nhập thất bại, vui lòng kiểm tra lại."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Đăng nhập hệ thống truy xuất thủy sản</h2>
        <p className="auth-subtitle">
          Vui lòng đăng nhập bằng tài khoản đã được cấp (Fisherman, Processor,...)
        </p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Tên đăng nhập
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="vd: fisher1"
              required
            />
          </label>

          <label>
            Mật khẩu
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
}




// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/useAuth";
// import {
//   Layout,
//   Card,
//   Form,
//   Input,
//   Button,
//   Typography,
//   Alert,
// } from "antd";
// import { LockOutlined, UserOutlined } from "@ant-design/icons";

// const { Content } = Layout;
// const { Title, Text } = Typography;

// export default function Login() {
//   const navigate = useNavigate();
  
//     const  {login}  = useAuth();
//   const [error, setError] = useState("");
//   const [submitting, setSubmitting] = useState(false);

//   const onFinish = async (values) => {
//     setError("");
//     setSubmitting(true);
//     try {
//       const info = await login(values.username, values.password);
//       console.log("Logged in user info:", info);
//       // Điều hướng theo role
//       switch (info.role) {
//         case "Fisherman":
//           navigate("/fisherman");
//           break;
//         case "PROCESSOR":
//           navigate("/processor");
//           break;
//         case "TRANSPORT":
//           navigate("/transport");
//           break;
//         case "DISTRIBUTOR":
//           navigate("/distributor");
//           break;
//         case "RETAILER":
//           navigate("/retailer");
//           break;
//         case "ADMIN":
//         default:
//           navigate("/fisherman");
//           break;
//       }
//     } catch (err) {
//       console.error(err);
//       setError(
//         err.response?.data?.error || "Đăng nhập thất bại, vui lòng kiểm tra lại."
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <Layout style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0f766e,#0ea5e9)" }}>
//       <Content
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           padding: 16,
//         }}
//       >
//         <Card
//           style={{ maxWidth: 420, width: "100%", boxShadow: "0 12px 30px rgba(15,23,42,0.35)" }}
//         >
//           <Title level={3} style={{ marginBottom: 4 }}>
//             Đăng nhập hệ thống truy xuất thủy sản
//           </Title>
//           <Text type="secondary">
//             Sử dụng tài khoản đã được cấp (Fisherman, Processor, Transport, ...)
//           </Text>

//           {error && (
//             <Alert
//               style={{ marginTop: 16 }}
//               message={error}
//               type="error"
//               showIcon
//             />
//           )}

//           <Form
//             layout="vertical"
//             style={{ marginTop: 16 }}
//             onFinish={onFinish}
//           >
//             <Form.Item
//               label="Tên đăng nhập"
//               name="username"
//               rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập" }]}
//             >
//               <Input
//                 prefix={<UserOutlined />}
//                 placeholder="vd: fisher1"
//               />
//             </Form.Item>

//             <Form.Item
//               label="Mật khẩu"
//               name="password"
//               rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
//             >
//               <Input.Password
//                 prefix={<LockOutlined />}
//                 placeholder="••••••••"
//               />
//             </Form.Item>

//             <Form.Item>
//               <Button
//                 type="primary"
//                 htmlType="submit"
//                 block
//                 loading={submitting}
//               >
//                 Đăng nhập
//               </Button>
//             </Form.Item>
//           </Form>
//         </Card>
//       </Content>
//     </Layout>
//   );
// }





// src/App.jsx
// import React from "react";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { AuthProvider } from "./context/AuthContext";
// import ProtectedRoute from "./components/ProtectedRoute";

// import Login from "./pages/Auth/Login";
// import FishermanDashboard from "./pages/Fisherman/Dashboard";
// import CatchDetail from "./pages/Fisherman/CatchDetail";

// export default function App() {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <Routes>
//           <Route path="/login" element={<Login />} />

//           <Route
//             path="/fisherman"
//             element={
//               <ProtectedRoute allowRoles={["Fisherman", "ADMIN"]}>
//                 <FishermanDashboard />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/fisherman/catches/:id"
//             element={
//               <ProtectedRoute allowRoles={["Fisherman", "ADMIN"]}>
//                 <CatchDetail />
//               </ProtectedRoute>
//             }
//           />

//           <Route path="/" element={<Navigate to="/login" replace />} />
//           <Route path="*" element={<div>404 - Không tìm thấy trang</div>} />
//         </Routes>
//       </BrowserRouter>
//     </AuthProvider>
//   );
// }


// src/App.jsx
// import React from "react";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { AuthProvider } from "./context/AuthContext";
// import ProtectedRoute from "./components/ProtectedRoute";

// import Login from "./pages/Auth/Login";
// import FishermanDashboard from "./pages/Fisherman/Dashboard";
// import CatchDetail from "./pages/Fisherman/CatchDetail";

// export default function App() {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <Routes>
//           <Route path="/login" element={<Login />} />

//           <Route
//             path="/fisherman"
//             element={
//               <ProtectedRoute allowRoles={["Fisherman", "Admin"]}>
//                 <FishermanDashboard />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/fisherman/catches/:id"
//             element={
//               <ProtectedRoute allowRoles={["Fisherman", "ADMIN"]}>
//                 <CatchDetail />
//               </ProtectedRoute>
//             }
//           />

//           <Route path="/" element={<Navigate to="/login" replace />} />
//           <Route path="*" element={<div style={{ padding: 24 }}>404 - Không tìm thấy trang</div>} />
//         </Routes>
//       </BrowserRouter>
//     </AuthProvider>
//   );
// }





import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Auth/Login";
import FishermanDashboard from "./pages/Fisherman/Dashboard";
import CatchDetail from "./pages/Fisherman/CatchDetail";

// 👇 các dashboard mới
import ProcessorDashboard from "./pages/Processor/Dashboard";
import TransportDashboard from "./pages/Transport/Dashboard";
import DistributorDashboard from "./pages/Distributor/Dashboard";
import RetailerDashboard from "./pages/Retailer/Dashboard";
import PublicTracePage from "./pages/Public/TracePage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Fisherman */}
          <Route
            path="/fisherman"
            element={
              <ProtectedRoute allowRoles={["Fisherman", "ADMIN"]}>
                <FishermanDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/fisherman/catches/:id"
            element={
              <ProtectedRoute allowRoles={["Fisherman", "ADMIN"]}>
                <CatchDetail />
              </ProtectedRoute>
            }
          />

          {/* Processor */}
          <Route
            path="/processor"
            element={
              <ProtectedRoute allowRoles={["Processor", "ADMIN"]}>
                <ProcessorDashboard />
              </ProtectedRoute>
            }
          />

          {/* Transport */}
          <Route
            path="/transport"
            element={
              <ProtectedRoute allowRoles={["Transporter", "ADMIN"]}>
                <TransportDashboard />
              </ProtectedRoute>
            }
          />

          {/* Distributor */}
          <Route
            path="/distributor"
            element={
              <ProtectedRoute allowRoles={["Distributor", "ADMIN"]}>
                <DistributorDashboard />
              </ProtectedRoute>
            }
          />

          {/* Retailer */}
          <Route
            path="/retailer"
            element={
              <ProtectedRoute allowRoles={["Retailer", "ADMIN"]}>
                <RetailerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Default */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<div style={{ padding: 24 }}>404 - Không tìm thấy trang</div>} />
          <Route path="/trace/:id" element={<PublicTracePage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

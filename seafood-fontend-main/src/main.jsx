// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import App from './App.jsx'
// import 'antd/dist/reset.css'   // style reset mới của antd v5
// import './index.css'


// ReactDOM.createRoot(document.getElementById('root')).render(
//   // <React.StrictMode>
//     <App />
//   // </React.StrictMode>,
// )



// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

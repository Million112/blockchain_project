const jwt = require("jsonwebtoken");
const SECRET = "fabric-secret";

exports.verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Không có token" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: "Token không hợp lệ" });
  }
};

exports.authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => { 
    if (!allowedRoles.includes(req.user.role)) {
     return res.status(403).json({ message: 'Access denied: insufficient role' }); } 
     next(); };
};

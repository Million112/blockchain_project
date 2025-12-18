const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  fullName: { type: String },                
     
  phone: { type: String },                   
  address: { type: String },                 
  organization: { type: String },            
  role: {
    type: String,
    enum: ['Admin','Fisherman','Processor','Transporter','Retailer',"Distributor"],
    default: 'Fisherman'
  },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }, // 👈 Trạng thái tài khoản
  lastLogin: { type: Date },                 // 👈 Lần đăng nhập gần nhất
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);

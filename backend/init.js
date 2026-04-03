// backend/init.js
const mongoose = require('mongoose');
const User = require('./models/User');
const config = require('./config');

// 连接数据库
mongoose.connect(config.mongoURI).then(async () => {
  console.log('数据库连接成功');
  
  // 检查是否已存在用户
  const existingUser = await User.findOne({ username: '珀莱雅' });
  if (existingUser) {
    console.log('用户已存在');
    mongoose.disconnect();
    return;
  }
  
  // 创建新用户
  const user = new User({
    username: '珀莱雅',
    password: '12345678'
  });
  
  await user.save();
  console.log('用户创建成功');
  mongoose.disconnect();
}).catch(err => {
  console.error('数据库连接失败:', err);
});
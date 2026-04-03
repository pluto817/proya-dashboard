// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config');
const authRoutes = require('./routes/auth');

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 数据库连接
mongoose.connect(config.mongoURI).then(() => console.log('数据库连接成功')).catch(err => console.log(err));

// 路由
app.use('/api/auth', authRoutes);

// 启动服务器
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`服务器运行在端口 ${PORT}`));
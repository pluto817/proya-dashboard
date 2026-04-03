// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config');

// 注册
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = new User({ username, password });
    await user.save();
    res.json({ success: true, message: '注册成功' });
  } catch (error) {
    res.json({ success: false, message: '注册失败' });
  }
});

// 登录
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.json({ success: false, message: '用户不存在' });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.json({ success: false, message: '密码错误' });
    }
    const token = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: '7d' });
    res.json({ success: true, token, user: { id: user._id, username: user.username } });
  } catch (error) {
    res.json({ success: false, message: '登录失败' });
  }
});

module.exports = router;
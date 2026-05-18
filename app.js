
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// MongoDB Connection (أزلنا الخيارات المهملة)
mongoose.connect('mongodb://mongo:27017/kafiilDB')
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// Define a simple API route (تحديث الرسالة)
app.get('/api/message', (req, res) => {
  res.json({ message: 'مرحبًا من خدمة كفيل! تطبيقك يعمل داخل Docker مع MongoDB. 🚀' });
});

// Example Mongoose model
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
});
const User = mongoose.model('User', userSchema);

// API endpoints for users (إضافة error handling)
app.post('/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (err) {
    res.status(500).send({ error: 'خطأ في حفظ المستخدم' });
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    res.status(500).send({ error: 'خطأ في جلب المستخدمين' });
  }
});

// Catch-all handler for SPA (إصلاح الخطأ السابق)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(3000, () => console.log('🚀 App running on port 3000'));

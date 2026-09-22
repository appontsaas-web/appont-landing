const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('./lib/models');

const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { email, password } = JSON.parse(event.body);

    if (!MONGODB_URI || !JWT_SECRET) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Missing env vars' }) };
    }

    await mongoose.connect(MONGODB_URI);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      await mongoose.disconnect();
      return { statusCode: 400, body: JSON.stringify({ error: 'User already exists' }) };
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const user = new User({ email, password: hashedPassword, role: 'client' });
    await user.save();

    const token = jwt.sign({ userId: user._id, role:
cat > netlify/functions/auth-login.js << 'EOF'
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('./lib/models');

const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { email, password } = JSON.parse(event.body);

    if (!MONGODB_URI || !JWT_SECRET) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Missing env vars' }) };
    }

    await mongoose.connect(MONGODB_URI);
    const user = await User.findOne({ email });

    if (!user || !(await bcryptjs.compare(password, user.password))) {
      await mongoose.disconnect();
      return { statusCode: 401, body: JSON.stringify({ error: 'Invalid credentials' }) };
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '30d' });
    await mongoose.disconnect();

    return {
      statusCode: 200,
      body: JSON.stringify({ token, userId: user._id, role: user.role })
    };
  } catch (error) {
    console.error('Login error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { verifyToken } = require('./lib/auth');
const { User, Project } = require('./lib/models');

const MONGODB_URI = process.env.REACT_APP_MONGODB_URI;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    await mongoose.connect(MONGODB_URI);
    const authHeader = event.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '');
    const user = verifyToken(token);

    if (!user || user.role !== 'admin') {
      return { statusCode: 403, body: JSON.stringify({ error: 'Admin access required' }) };
    }

    const { client_email, name, description, cost, timeline, team, auto_email } = JSON.parse(event.body);

    let client = await User.findOne({ email: client_email });
    if (!client && auto_email) {
      const tempPassword = Math.random().toString(36).slice(-12);
      const hashedPassword = await bcrypt.hash(tempPassword, 10);
      client = new User({ email: client_email, password: hashedPassword, role: 'client' });
      await client.save();
    }

    if (!client) {
      return { statusCode: 404, body: JSON.stringify({ error: 'Client not found' }) };
    }

    const project = new Project({ user_id: client._id, name, description, cost, timeline, team });
    await project.save();

    return {
      statusCode: 200,
      body: JSON.stringify({ project })
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};

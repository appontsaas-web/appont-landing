const mongoose = require('mongoose');
const { Project } = require('./lib/models');
const { verifyToken } = require('./lib/auth');

const MONGODB_URI = process.env.MONGODB_URI;

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const token = event.headers.authorization?.split(' ')[1];
    const decoded = verifyToken(token);

    if (!MONGODB_URI) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Missing MONGODB_URI' }) };
    }

    await mongoose.connect(MONGODB_URI);
    const projects = await Project.find({ userId: decoded.userId });
    await mongoose.disconnect();

    return {
      statusCode: 200,
      body: JSON.stringify(projects)
    };
  } catch (error) {
    console.error('Get projects error:', error);
    return { statusCode: 401, body: JSON.stringify({ error: error.message }) };
  }
};

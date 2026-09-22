const mongoose = require('mongoose');
const { Anthropic } = require('@anthropic-ai/sdk');
const { verifyToken } = require('./lib/auth');
const { Project, Invoice } = require('./lib/models');

const MONGODB_URI = process.env.REACT_APP_MONGODB_URI;
const API_KEY = process.env.REACT_APP_ANTHROPIC_API_KEY;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    await mongoose.connect(MONGODB_URI);
    const authHeader = event.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '');
    const user = verifyToken(token);

    if (!user) {
      return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
    }

    const { message, project_id } = JSON.parse(event.body);
    
    const project = await Project.findOne({ _id: project_id, user_id: user.id }).lean();
    if (!project) {
      return { statusCode: 403, body: JSON.stringify({ error: 'Project not found' }) };
    }

    const invoices = await Invoice.find({ project_id }).lean();
    const context = `
Project: ${project.name}
Status: ${project.status}
Cost: $${project.cost}
Timeline: ${project.timeline}
Team: ${project.team.join(', ')}

Invoices:
${invoices.map(inv => `- $${inv.amount} (${inv.status})`).join('\n')}
    `.trim();

    const client = new Anthropic({ apiKey: API_KEY });
    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: `You are a helpful project manager assistant. Context:\n\n${context}\n\nUser: ${message}`
        }
      ]
    });

    const reply = response.content[0].type === 'text' ? response.content[0].text : '';

    return {
      statusCode: 200,
      body: JSON.stringify({ reply })
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};

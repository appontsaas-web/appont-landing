const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body);
    const { projectType, description, targetAudience, techStack, teamSize, features, integrations, industry, budget, timeline } = data;

    const prompt = `You are an expert software architect. Based on the following project requirements, generate a professional solution proposal:

Project Type: ${projectType}
Description: ${description}
Target Audience: ${targetAudience}
Tech Stack: ${techStack}
Team Size: ${teamSize}
Features: ${features}
Integrations: ${integrations}
Industry: ${industry}
Budget: $${budget}
Timeline: ${timeline}

Generate a comprehensive solution proposal including:
1. Technical Architecture
2. Implementation Timeline (phases)
3. Team Requirements
4. Cost Breakdown
5. Risks and Mitigation
6. Success Metrics

Format as clear, professional text.`;

    const message = await client.messages.create({
      model: 'claude-opus-4-1',
      max_tokens: 1024,
      messages: [
        { role: 'user', content: prompt }
      ],
    });

    const solution = message.content[0].text;

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        solution: solution,
        _id: Math.random().toString(36).substr(2, 9),
      }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

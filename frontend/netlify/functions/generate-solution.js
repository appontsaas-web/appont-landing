const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

exports.handler = async (event) => {
  try {
    const data = JSON.parse(event.body);
    const { projectType, description, targetAudience, techStack, teamSize, features, integrations, industry, budget, timeline } = data;

    const prompt = `Generate a solution proposal for:
Project: ${projectType}
Description: ${description}
Budget: $${budget}

Include: Architecture, Timeline, Team, Costs, Risks, Metrics`;

    const message = await client.messages.create({
      model: 'claude-opus-4-1',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        solution: message.content[0].text,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

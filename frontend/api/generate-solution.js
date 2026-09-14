// api/generate-solution.js
// Place this file at: frontend/api/generate-solution.js

import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { projectType, description, budget, timeline } = req.body;

    if (!description || !projectType || !budget || !timeline) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const prompt = `You are an expert project consultant at a top development agency. 
    
A potential client has submitted the following project request:

PROJECT TYPE: ${projectType}
DESCRIPTION: ${description}
BUDGET: ${budget}
TIMELINE: ${timeline}

Based on this information, provide a professional, detailed custom solution that includes:

1. **Executive Summary** - Brief overview of what you'll build
2. **Project Scope** - What's included and what's not
3. **Technology Stack** - Recommended technologies (be specific)
4. **Key Deliverables** - Main milestones and deliverables
5. **Timeline Breakdown** - Realistic phases and timeline
6. **Investment Range** - Cost estimate based on their budget
7. **Success Metrics** - How we'll measure success
8. **Next Steps** - What happens after they approve

Keep it professional, concise, and actionable. Use clear formatting with headers and bullet points.
Do NOT ask for more information - provide a complete solution based on what they've shared.`;

    const message = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const solution =
      message.content[0].type === "text" ? message.content[0].text : "";

    return res.status(200).json({ solution });
  } catch (error) {
    console.error("Error generating solution:", error);
    return res
      .status(500)
      .json({ error: "Failed to generate solution. Please try again." });
  }
}

const axios = require('axios');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.1-8b-instruct:free';

async function generateEmailDraft(taskText, relationshipContext = null, templateContext = null) {
  try {
    const systemPrompt = `You are MailPilot, an AI email assistant. 
Your job is to extract the recipient's name, craft a subject line, and draft an email body based on the user's task.
${relationshipContext ? `\nThe user's relationship with the recipient is: "${relationshipContext}". Adjust the tone accordingly.` : ''}
${templateContext ? `\nUse this template as a starting point if applicable:\nSubject: ${templateContext.subject_template}\nBody: ${templateContext.body_template}` : ''}

You MUST respond with ONLY valid JSON in this exact structure:
{
  "recipientName": "Name or empty string if not found",
  "subject": "Email subject",
  "body": "Email body content"
}

Do not include any prose, markdown formatting, or markdown code fences (like \`\`\`json). Just the raw JSON object.`;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: OPENROUTER_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: taskText }
        ],
        response_format: { type: "json_object" }
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3001',
          'X-Title': 'MailPilot'
        }
      }
    );

    const content = response.data.choices[0].message.content.trim();
    return JSON.parse(content);
  } catch (error) {
    console.error('OpenRouter API Error:', error.response?.data || error.message);
    throw new Error('Failed to generate email draft via AI');
  }
}

module.exports = {
  generateEmailDraft
};

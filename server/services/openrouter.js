const axios = require('axios');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Ordered list of known free models to try, with the auto-router as a final fallback
const FALLBACK_MODELS = [
  'google/gemma-4-31b-it:free',
  'poolside/laguna-s-2.1:free',
  'openrouter/free'
];

async function generateEmailDraft(taskText, relationshipContext = null, templateContext = null) {
  let systemPrompt = `You are MailPilot, an AI email assistant. 
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

  for (let attempt = 1; attempt <= 2; attempt++) {
    let lastParseError = null;

    for (const model of FALLBACK_MODELS) {
      try {
        const response = await axios.post(
          'https://openrouter.ai/api/v1/chat/completions',
          {
            model: model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: taskText }
            ],
            response_format: { type: "json_object" }
          },
          {
            timeout: 5000,
            headers: {
              'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': 'http://localhost:3001',
              'X-Title': 'MailPilot'
            }
          }
        );

        let content = response.data.choices[0].message.content.trim();
        
        // Clean up markdown formatting
        if (content.startsWith('```json')) {
          content = content.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (content.startsWith('```')) {
          content = content.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }

        // Fix simple trailing commas
        content = content.replace(/,\s*([\}\]])/g, '$1');

        try {
          const parsed = JSON.parse(content);
          console.log(`Successfully generated draft using model: ${model}`);
          return parsed;
        } catch (parseError) {
          console.warn(`Model ${model} returned invalid JSON.`);
          lastParseError = parseError;
          // Break out of the models loop and let the attempt loop retry with a stricter prompt
          break;
        }
      } catch (apiError) {
        console.warn(`Model ${model} failed:`, apiError.response?.data?.error?.message || apiError.message);
        // Continue to the next model in the FALLBACK_MODELS list
      }
    }

    if (lastParseError) {
      if (attempt === 1) {
        console.warn('JSON parsing failed, retrying with stricter prompt...');
        systemPrompt += '\n\nCRITICAL: Respond with ONLY valid JSON, no markdown formatting, no extra text.';
        continue;
      } else {
        console.error('Failed to parse AI response after 2 attempts:', lastParseError);
        throw new Error('AI returned an invalid response format. Please try again.');
      }
    }

    // If we made it here without a lastParseError, it means all models failed due to API errors.
    throw new Error('All fallback models failed to generate a response. Please try again later.');
  }
}

module.exports = {
  generateEmailDraft
};

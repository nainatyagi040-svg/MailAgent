const axios = require('axios');

const MAILTRAP_API_TOKEN = process.env.MAILTRAP_API_TOKEN;
const MAILTRAP_SENDER_EMAIL = process.env.MAILTRAP_SENDER_EMAIL || 'hello@mailpilot.ai';

async function sendEmail(toEmail, subject, body) {
  try {
    const response = await axios.post(
      'https://send.api.mailtrap.io/api/send',
      {
        from: { email: MAILTRAP_SENDER_EMAIL, name: 'MailPilot Agent' },
        to: [{ email: toEmail }],
        subject: subject,
        text: body,
      },
      {
        headers: {
          'Authorization': `Bearer ${MAILTRAP_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Mailtrap API Error:', error.response?.data || error.message);
    throw new Error('Failed to send email via Mailtrap');
  }
}

module.exports = {
  sendEmail
};

/*
 * Serverless email handler for contact form submissions.
 *
 * This function is designed to run on serverless platforms such as Netlify
 * Functions, Vercel, or Cloudflare Workers. It receives form data from the
 * contact page, sends a notification email to the site owner and a
 * confirmation email to the client. No data is stored.
 *
 * Environment variables required:
 *   SENDGRID_API_KEY  – API key for SendGrid (or another SMTP provider)
 *   OWNER_EMAIL       – Email address where notifications should be sent
 *   FROM_EMAIL        – Verified email address used as the sender
 */

const nodemailer = require('nodemailer');

async function sendMail(message) {
  // Configure the transporter. Replace with your email provider settings.
  const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    secure: false,
    auth: {
      user: 'apikey',
      pass: process.env.SENDGRID_API_KEY || 'YOUR_SENDGRID_API_KEY'
    }
  });
  await transporter.sendMail(message);
}

// Handler for Netlify and Vercel style requests
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  const data = req.body || {};

  const ownerEmail = process.env.OWNER_EMAIL || 'contact@qmsblueprint.com';
  const fromEmail = process.env.FROM_EMAIL || 'no-reply@qmsblueprint.com';

  // Compose notification email to site owner
  const ownerMessage = {
    from: fromEmail,
    to: ownerEmail,
    subject: 'New QMS Blueprint customization request',
    text: `A new customization request was submitted.\n\n` +
      `First name: ${data.firstName || ''}\n` +
      `Last name: ${data.lastName || ''}\n` +
      `Email: ${data.email || ''}\n` +
      `Company: ${data.companyName || ''}\n` +
      `Website: ${data.website || ''}\n` +
      `Industry: ${data.industry || ''}\n` +
      `Location: ${data.location || ''}\n` +
      `Certification timeframe: ${data.timeframe || ''}\n` +
      `Description: ${data.description || ''}\n` +
      `Existing documentation: ${data.existingDocs || ''}\n` +
      `Preferred contact method: ${data.preferredContact || ''}\n` +
      `Phone: ${data.phone || ''}\n` +
      `Message: ${data.message || ''}\n`
  };

  // Compose confirmation email to client
  const clientMessage = {
    from: fromEmail,
    to: data.email,
    subject: 'QMS Blueprint — Customization Request Received',
    text: `Thanks—your request was received. You will receive a detailed QMS questionnaire by email. Response times vary; messages are typically answered after standard work hours.\n\n` +
      `For your reference, a copy of your submission is below.\n\n` +
      `First name: ${data.firstName || ''}\n` +
      `Last name: ${data.lastName || ''}\n` +
      `Company: ${data.companyName || ''}\n` +
      `Website: ${data.website || ''}\n` +
      `Industry: ${data.industry || ''}\n` +
      `Location: ${data.location || ''}\n` +
      `Certification timeframe: ${data.timeframe || ''}\n` +
      `Description: ${data.description || ''}\n` +
      `Existing documentation: ${data.existingDocs || ''}\n` +
      `Preferred contact method: ${data.preferredContact || ''}\n` +
      `Phone: ${data.phone || ''}\n` +
      `Message: ${data.message || ''}\n`
  };

  try {
    await sendMail(ownerMessage);
    await sendMail(clientMessage);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: true }));
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Error sending email' }));
  }
};
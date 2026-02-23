// qms-blueprint-site/api/contact.js
// Netlify Function (no npm deps). Sends emails via SendGrid HTTP API.
// Env vars needed in Netlify:
//   SENDGRID_API_KEY
//   OWNER_EMAIL   (default: contact@qmsblueprint.com)
//   FROM_EMAIL    (must be a verified sender in SendGrid)

const OWNER_DEFAULT = "contact@qmsblueprint.com";

function json(body, statusCode = 200) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(body),
  };
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  let data;
  try {
    data = JSON.parse(event.body || "{}");
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const apiKey = process.env.SENDGRID_API_KEY;
  const ownerEmail = process.env.OWNER_EMAIL || OWNER_DEFAULT;
  const fromEmail = process.env.FROM_EMAIL;

  if (!apiKey) return json({ error: "Missing SENDGRID_API_KEY" }, 500);
  if (!fromEmail) return json({ error: "Missing FROM_EMAIL (must be verified in SendGrid)" }, 500);
  if (!data.email) return json({ error: "Email is required" }, 400);

  const submitted = [
    `First name: ${data.firstName || ""}`,
    `Last name: ${data.lastName || ""}`,
    `Email: ${data.email || ""}`,
    `Company: ${data.companyName || ""}`,
    `Website: ${data.website || ""}`,
    `Industry: ${data.industry || ""}`,
    `Location: ${data.location || ""}`,
    `Certification timeframe: ${data.timeframe || ""}`,
    `Description: ${data.description || ""}`,
    `Existing documentation: ${data.existingDocs || ""}`,
    `Preferred contact method: ${data.preferredContact || ""}`,
    `Phone: ${data.phone || ""}`,
    `Message: ${data.message || ""}`,
  ].join("\n");

  const ownerMsg = {
    personalizations: [{ to: [{ email: ownerEmail }] }],
    from: { email: fromEmail },
    subject: "New QMS Blueprint customization request",
    content: [{ type: "text/plain", value: `A new customization request was submitted.\n\n${submitted}\n` }],
  };

  const clientMsg = {
    personalizations: [{ to: [{ email: data.email }] }],
    from: { email: fromEmail },
    subject: "QMS Blueprint — Customization Request Received",
    content: [
      {
        type: "text/plain",
        value:
          "Thanks—your request was received. You will receive a detailed QMS questionnaire by email. Response times vary; messages are typically answered after standard work hours.\n\n" +
          "For your reference, a copy of your submission is below.\n\n" +
          submitted +
          "\n",
      },
    ],
  };

  async function sendSendGrid(msg) {
    const resp = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(msg),
    });

    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`SendGrid error: ${resp.status} ${text}`);
    }
  }

  try {
    await sendSendGrid(ownerMsg);
    await sendSendGrid(clientMsg);
    return json({ success: true });
  } catch (err) {
    return json({ error: "Error sending email", detail: String(err.message || err) }, 500);
  }
};

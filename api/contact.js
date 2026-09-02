const MAX_BODY_BYTES = 32 * 1024;
const MAX_NAME_LENGTH = 120;
const MAX_EMAIL_LENGTH = 254;
const MAX_SUBJECT_LENGTH = 160;
const MAX_MESSAGE_LENGTH = 5000;
const MAX_OPTIONAL_LENGTH = 120;
const PORTFOLIO_RECIPIENT = "kerolosmorcos3@gmail.com";
const DELIVERY_ERROR_MESSAGE = "Your message could not be sent right now. Please try again.";

function respond(res, status, payload) {
  res.setHeader("Cache-Control", "no-store");
  return res.status(status).json(payload);
}

function normalize(value) {
  return typeof value === "string" ? value.trim() : "";
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return respond(res, 405, { success: false, message: "Method not allowed." });
  }

  const contentLength = Number(req.headers?.["content-length"] || 0);
  if (contentLength > MAX_BODY_BYTES) return respond(res, 413, { success: false, message: "Request is too large." });

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return respond(res, 400, { success: false, message: "Invalid request body." });
    }
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) return respond(res, 400, { success: false, message: "Invalid request body." });

  if (normalize(body.website)) return respond(res, 202, { success: true });

  const lengthChecks = [
    ["name", MAX_NAME_LENGTH],
    ["email", MAX_EMAIL_LENGTH],
    ["subject", MAX_SUBJECT_LENGTH],
    ["message", MAX_MESSAGE_LENGTH],
    ["phone", MAX_OPTIONAL_LENGTH],
    ["budget", MAX_OPTIONAL_LENGTH],
    ["projectType", MAX_OPTIONAL_LENGTH],
    ["otherProjectType", MAX_OPTIONAL_LENGTH],
  ];
  if (lengthChecks.some(([field, maxLength]) => typeof body[field] === "string" && body[field].trim().length > maxLength)) {
    return respond(res, 400, { success: false, message: "One or more fields are too long." });
  }

  const name = normalize(body.name);
  const email = normalize(body.email);
  const projectTypeKey = normalize(body.projectType);
  const otherProjectType = normalize(body.otherProjectType).replace(/[\r\n]+/g, " ");
  const subject = (normalize(body.subject) || (projectTypeKey === "other" ? "Other" : "New portfolio inquiry")).replace(/[\r\n]+/g, " ");
  const projectType = projectTypeKey === "other" && otherProjectType ? `${subject} — ${otherProjectType}` : subject;
  const message = normalize(body.message);
  const phone = normalize(body.phone);
  const budget = normalize(body.budget);

  if (!name || !email || !message) return respond(res, 400, { success: false, message: "Name, email, and message are required." });
  if (!isValidEmail(email)) return respond(res, 400, { success: false, message: "Please provide a valid email address." });
  if (projectTypeKey === "other" && !otherProjectType) return respond(res, 400, { success: false, message: "Please specify the other project type." });

  const apiKey = process.env.RESEND_API_KEY;
  const configuredRecipient = normalize(process.env.CONTACT_TO_EMAIL);
  const recipient = configuredRecipient === PORTFOLIO_RECIPIENT ? configuredRecipient : PORTFOLIO_RECIPIENT;
  const sender = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !sender) {
    console.error("Contact delivery configuration incomplete", {
      hasApiKey: Boolean(apiKey),
      hasSender: Boolean(sender),
      recipientMatchesPortfolioInbox: configuredRecipient === PORTFOLIO_RECIPIENT,
    });
    return respond(res, 500, { success: false, message: DELIVERY_ERROR_MESSAGE });
  }

  const fields = [
    ["Name", name],
    ["Email", email],
    ["Phone", phone || "Not provided"],
    ["Project type", projectType],
    ["Budget", budget || "Not provided"],
    ["Message", message],
    ["Source", "Portfolio contact form"],
  ];
  const receivedAt = new Date().toISOString();
  const fieldRows = fields.map(([label, value]) => `
    <tr>
      <td style="padding:10px 0;color:#94a3b8;font-size:13px;vertical-align:top;width:130px">${escapeHtml(label)}</td>
      <td style="padding:10px 0;color:#e2e8f0;white-space:pre-line">${escapeHtml(value)}</td>
    </tr>`).join("");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: sender,
        to: [recipient],
        reply_to: email,
        subject: `[Portfolio] ${projectType}`,
        html: `<div style="background:#020617;padding:32px;font-family:Arial,sans-serif;color:#e2e8f0"><div style="max-width:620px;margin:0 auto;background:#0f172a;border:1px solid #334155;border-radius:18px;padding:28px"><div style="height:4px;background:linear-gradient(90deg,#6366f1,#8b5cf6,#a855f7);border-radius:99px;margin-bottom:24px"></div><h1 style="margin:0 0 20px;color:#fff;font-size:22px">New portfolio contact message</h1><table style="width:100%;border-collapse:collapse">${fieldRows}</table><p style="margin:24px 0 0;color:#64748b;font-size:12px">Received at ${escapeHtml(receivedAt)}</p></div></div>`,
      }),
    });

    if (!response.ok) {
      const responseBody = await response.text().catch(() => "");
      console.error("Resend contact delivery failed", { status: response.status, responseBody: responseBody.slice(0, 1000) });
      return respond(res, 500, { success: false, message: DELIVERY_ERROR_MESSAGE });
    }
    return respond(res, 200, { success: true });
  } catch (error) {
    console.error("Contact delivery request failed", { name: error?.name, message: error?.message });
    return respond(res, 500, { success: false, message: DELIVERY_ERROR_MESSAGE });
  }
}

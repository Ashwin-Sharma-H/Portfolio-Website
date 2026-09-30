import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type WindowState = { count: number; resetAt: number };
const rateWindowMs = 60 * 60 * 1000;
const maxRequests = 5;
const requestCounts = new Map<string, WindowState>();

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: NextRequest) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 12_000) {
    return NextResponse.json({ message: "The message is too large. Please shorten it and try again." }, { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json() as Record<string, unknown>;
  } catch {
    return NextResponse.json({ message: "Please send a valid form submission." }, { status: 400 });
  }

  if (clean(body.website, 200)) return NextResponse.json({ message: "Thanks. Your message has been received." });

  const name = clean(body.name, 100);
  const email = clean(body.email, 254);
  const subject = clean(body.subject, 160);
  const message = clean(body.message, 5000);
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name || !emailPattern.test(email) || !subject || message.length < 10) {
    return NextResponse.json({ message: "Please check the required fields and try again." }, { status: 400 });
  }

  const clientKey = request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || "local-client";
  const now = Date.now();
  const existing = requestCounts.get(clientKey);
  if (existing && existing.resetAt > now && existing.count >= maxRequests) {
    return NextResponse.json({ message: "Too many messages from this connection. Please try again later." }, { status: 429 });
  }
  requestCounts.set(clientKey, existing && existing.resetAt > now
    ? { count: existing.count + 1, resetAt: existing.resetAt }
    : { count: 1, resetAt: now + rateWindowMs });
  for (const [key, value] of requestCounts) if (value.resetAt <= now) requestCounts.delete(key);

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    return NextResponse.json({ message: "The contact service is not configured yet. Please reach out on LinkedIn." }, { status: 503 });
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      signal: AbortSignal.timeout(10_000),
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `Portfolio contact: ${subject}`,
        text: `From: ${name} <${email}>\n\n${message}`
      })
    });
    if (!response.ok) return NextResponse.json({ message: "Your message could not be sent right now. Please try again later." }, { status: 502 });
    return NextResponse.json({ message: "Your message has been sent." });
  } catch {
    return NextResponse.json({ message: "Your message could not be sent right now. Please try again later." }, { status: 502 });
  }
}

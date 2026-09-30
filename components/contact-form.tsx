"use client";

import { FormEvent, useState } from "react";

type State = "idle" | "sending" | "success" | "error";

export function ContactForm() {
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    setMessage("");
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await response.json() as { message?: string };
      if (!response.ok) throw new Error(result.message || "Your message could not be sent. Please try again.");
      form.reset();
      setState("success");
      setMessage("Thanks for reaching out. Your message has been sent.");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>Name<input name="name" autoComplete="name" required maxLength={100} placeholder="Your name" /></label>
        <label>Email<input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com" /></label>
      </div>
      <label>Subject<input name="subject" required maxLength={160} placeholder="What would you like to discuss?" /></label>
      <label>Message<textarea name="message" required minLength={10} maxLength={5000} rows={5} placeholder="Tell me a little about it…" /></label>
      <label className="honeypot" aria-hidden="true">Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label>
      <div className="form-submit-row">
        <button className="button button-primary" type="submit" disabled={state === "sending"}>
          {state === "sending" ? "Sending…" : "Send message"}<span aria-hidden="true">↗</span>
        </button>
        <p className={`form-status ${state}`} role="status" aria-live="polite">{message}</p>
      </div>
    </form>
  );
}

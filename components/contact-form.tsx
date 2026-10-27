"use client";

import { ValidationError, useForm } from "@formspree/react";
import { useEffect, useRef } from "react";

export function ContactForm() {
  const [state, handleSubmit] = useForm("mbggoezw");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.succeeded) formRef.current?.reset();
  }, [state.succeeded]);

  return (
    <form ref={formRef} className="contact-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>Name<input name="name" autoComplete="name" required maxLength={100} placeholder="Your name" /></label>
        <label>Email<input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com" /><ValidationError prefix="Email" field="email" errors={state.errors} /></label>
      </div>
      <label>Subject<input name="_subject" required maxLength={160} placeholder="What would you like to discuss?" /></label>
      <label>Message<textarea name="message" required minLength={10} maxLength={5000} rows={5} placeholder="Tell me a little about it…" /><ValidationError prefix="Message" field="message" errors={state.errors} /></label>
      <label className="honeypot" aria-hidden="true">Leave this field empty<input name="_gotcha" tabIndex={-1} autoComplete="off" /></label>
      <div className="form-submit-row">
        <button className="button button-primary" type="submit" disabled={state.submitting}>
          {state.submitting ? "Sending…" : "Send message"}<span aria-hidden="true">↗</span>
        </button>
        <div className={`form-status ${state.succeeded ? "success" : state.errors ? "error" : ""}`} role="status" aria-live="polite">
          {state.succeeded ? "Thanks for reaching out. Your message has been sent." : <ValidationError errors={state.errors} />}
        </div>
      </div>
    </form>
  );
}

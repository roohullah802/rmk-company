'use client';

import { useState } from 'react';
import { submitContactMessage } from '@/actions/messages';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await submitContactMessage({ name, email, subject, message });
      setSuccess(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch {
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-12 px-4 space-y-4 animate-fade-in">
        <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full w-fit mx-auto">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h3 className="text-xl font-bold text-white">Message Sent Successfully!</h3>
        <p className="text-zinc-400 text-sm max-w-sm mx-auto leading-relaxed">
          Thank you for contacting RMK. Our operations coordinator will review your request and get back to you shortly.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="btn-secondary text-xs font-bold px-4 py-2"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/25 text-red-400 rounded-lg text-sm flex gap-3 items-center">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="label">
            Your Name <span className="text-brand-amber">*</span>
          </label>
          <input
            id="name"
            type="text"
            required
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            className="input"
          />
        </div>

        <div>
          <label htmlFor="email" className="label">
            Email Address <span className="text-brand-amber">*</span>
          </label>
          <input
            id="email"
            type="email"
            required
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="input"
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="label">
          Subject / Project Name <span className="text-brand-amber">*</span>
        </label>
        <input
          id="subject"
          type="text"
          required
          placeholder="E.g., Excavator Rental DHA Phase 9"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          disabled={loading}
          className="input"
        />
      </div>

      <div>
        <label htmlFor="message" className="label">
          Message & Machinery Specs <span className="text-brand-amber">*</span>
        </label>
        <textarea
          id="message"
          required
          placeholder="Please describe your excavation scope, required machinery (e.g., PC300 excavator, bulldozers), site location, and mobilization duration..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={loading}
          className="textarea h-32"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full btn-primary flex justify-center py-3.5"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Sending Request...
          </>
        ) : (
          'Send Inquiry'
        )}
      </button>
    </form>
  );
}

const MAX_NAME = 100;
const MAX_EMAIL = 254;
const MAX_SUBJECT = 200;
const MAX_MESSAGE = 5000;

export function sanitizeText(input: string, maxLen: number): string {
  return input.slice(0, maxLen).trim();
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= MAX_EMAIL;
}

export interface ContactInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
  data: ContactInput;
}

export function validateContactForm(input: ContactInput): ValidationResult {
  const errors: Record<string, string> = {};
  const name = sanitizeText(input.name, MAX_NAME);
  const email = sanitizeText(input.email, MAX_EMAIL);
  const subject = sanitizeText(input.subject, MAX_SUBJECT);
  const message = sanitizeText(input.message, MAX_MESSAGE);

  if (!name) errors.name = 'Name is required';
  if (!email) errors.email = 'Email is required';
  else if (!isValidEmail(email)) errors.email = 'Please enter a valid email';
  if (!message) errors.message = 'Message is required';
  else if (message.length < 10) errors.message = 'Message must be at least 10 characters';

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    data: { name, email, subject, message },
  };
}

const SAFE_URL_PROTOCOLS = ['http:', 'https:', 'mailto:'];

export function sanitizeUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  try {
    const parsed = new URL(trimmed);
    if (!SAFE_URL_PROTOCOLS.includes(parsed.protocol)) return null;
    return trimmed;
  } catch {
    return null;
  }
}

export function getYouTubeEmbed(url: string | null): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url.trim());
    if (!['youtube.com', 'www.youtube.com', 'youtu.be'].includes(parsed.hostname)) return null;
    if (parsed.hostname === 'youtu.be') {
      const id = parsed.pathname.slice(1);
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    const videoId = parsed.searchParams.get('v');
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  } catch {
    return null;
  }
}

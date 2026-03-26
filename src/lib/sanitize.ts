/**
 * Sanitize a string to prevent XSS attacks.
 * Strips HTML tags, escapes dangerous characters, and trims whitespace.
 */
export function sanitize(input: string): string {
  return input
    // Strip HTML tags
    .replace(/<[^>]*>/g, '')
    // Escape special characters (order matters: & first)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}
